require('dotenv').config();
const AWS = require('aws-sdk');

console.log("AWS Config:", {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ? "***REDACTED***" : "MISSING",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? "***REDACTED***" : "MISSING"
  });

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Initialize AWS service clients
const ec2 = new AWS.EC2();
const s3 = new AWS.S3();
const rds = new AWS.RDS();
const elbv2 = new AWS.ELBv2();
const ecs = new AWS.ECS();

const awsFunctions = {
    /**
     * Compute Management Functions
     */
    createInstance: {
        execute: async (instanceName, instanceType, amiId) => {
            try {
                console.log("Attempting to create instance with params:", {
                    instanceName, instanceType, amiId
                });

                const clean = (str) => typeof str === 'string' ? str.replace(/^"|"$/g, '') : str;
    
                const params = {
                    ImageId: amiId.replace(/"/g, ''), // Remove quotes if present
                    InstanceType: instanceType.replace(/"/g, ''),
                    MinCount: 1,
                    MaxCount: 1,
                    TagSpecifications: [{
                        ResourceType: "instance",
                        Tags: [{ Key: "Name", Value: instanceName.replace(/"/g, '') }]
                    }]
                };
    
                const data = await ec2.runInstances(params).promise();
                console.log("AWS Response:", JSON.stringify(data, null, 2));
                
                return {
                    instanceId: data.Instances[0].InstanceId,
                    status: 'pending'
                };
            } catch (error) {
                console.error("AWS Error Details:", error);
                throw new Error(`Failed to create instance: ${error.message}`);
            }
        }
    },

    startInstance: {
        execute: async (instanceId) => {
            try {
                console.log("[startInstance] Raw input:", instanceId);
                const cleanId = instanceId.replace(/"/g, '');
                console.log("[startInstance] Cleaned ID:", cleanId);
                console.log("[startInstance] Calling AWS API...");
                const response = await ec2.startInstances({ 
                    InstanceIds: [cleanId] 
                }).promise();
                console.log("[startInstance] AWS Response:", response);
    
                const result = { 
                    instanceId: cleanId, 
                    status: 'started',
                    awsData: response.StartingInstances[0] 
                };
                console.log("[startInstance] Returning:", result);
                return result;
    
            } catch (error) {
                console.error("[startInstance] FAILED:", {
                    error: error.message,
                    code: error.code,
                    stack: error.stack
                });
                throw error;
            }
        }
    },

    stopInstance: {
        execute: async (instanceId) => {
            try {
                // 1. Log and clean input
                console.log("[stopInstance] Raw input:", instanceId);
                const cleanId = instanceId.replace(/"/g, '');
                console.log("[stopInstance] Cleaned ID:", cleanId);
    
                // 2. Execute AWS API call
                console.log("[stopInstance] Calling stopInstances API...");
                const response = await ec2.stopInstances({ 
                    InstanceIds: [cleanId] 
                }).promise();
                
                // 3. Log full AWS response
                console.log("[stopInstance] AWS Response:", JSON.stringify(response, null, 2));
                
                // 4. Return simplified status
                const result = {
                    instanceId: cleanId,
                    status: 'stopped',
                    previousState: response.StoppingInstances[0].PreviousState.Name,
                    currentState: response.StoppingInstances[0].CurrentState.Name
                };
                console.log("[stopInstance] Result:", result);
                return result;
    
            } catch (error) {
                console.error("[stopInstance] Error:", {
                    message: error.message,
                    code: error.code,
                    stack: error.stack
                });
                throw new Error(`StopInstance failed: ${error.message}`);
            }
        }
    },

    terminateInstance: {
        execute: async (instanceId) => {
            try {
                // 1. Input logging and cleaning
                console.log("[terminateInstance] Raw input:", instanceId);
                const cleanId = instanceId.replace(/"/g, '');
                console.log("[terminateInstance] Cleaned ID:", cleanId);
    
                // 2. Execute termination
                console.log("[terminateInstance] Calling terminateInstances API...");
                const response = await ec2.terminateInstances({
                    InstanceIds: [cleanId]
                }).promise();
                console.log("[terminateInstance] AWS Response:", JSON.stringify(response, null, 2));
                const result = {
                    instanceId: cleanId,
                    status: 'terminated',
                    shutdownState: response.TerminatingInstances[0].CurrentState.Name
                };
                console.log("[terminateInstance] Result:", result);
                return result;
    
            } catch (error) {
                console.error("[terminateInstance] FAILED:", {
                    error: error.message,
                    code: error.code,
                    awsRequestId: error.requestId,
                    statusCode: error.statusCode
                });
                throw new Error(`Termination failed: ${error.code}`);
            }
        }
    },

    resizeInstance: {
        execute: async (instanceId, newInstanceType) => {
            try {
                // 1. Input sanitization and logging
                console.log("[resizeInstance] Raw inputs:", { instanceId, newInstanceType });
                const cleanId = instanceId.replace(/"/g, '');
                const cleanType = newInstanceType.replace(/"/g, '');
                console.log("[resizeInstance] Cleaned inputs:", { instanceId: cleanId, instanceType: cleanType });
    
                // 2. Stop instance first
                console.log("[resizeInstance] Stopping instance...");
                await ec2.stopInstances({ InstanceIds: [cleanId] }).promise();
                await ec2.waitFor('instanceStopped', { InstanceIds: [cleanId] }).promise();
                console.log("[resizeInstance] Modifying instance type...");
                await ec2.modifyInstanceAttribute({
                    InstanceId: cleanId,
                    InstanceType: { Value: cleanType }
                }).promise();
    
                // 4. Restart instance
                console.log("[resizeInstance] Starting instance...");
                await ec2.startInstances({ InstanceIds: [cleanId] }).promise();
    
                // 5. Verify completion
                const describeResponse = await ec2.describeInstances({ InstanceIds: [cleanId] }).promise();
                const currentType = describeResponse.Reservations[0].Instances[0].InstanceType;
    
                console.log("[resizeInstance] Resize completed. Current type:", currentType);
                return {
                    instanceId: cleanId,
                    oldInstanceType: cleanType,
                    newInstanceType: currentType,
                    status: 'resized'
                };
    
            } catch (error) {
                console.error("[resizeInstance] FAILED:", {
                    error: error.message,
                    code: error.code,
                    stack: error.stack
                });
                throw new Error(`Resize failed at step: ${error.code || 'unknown'}`);
            }
        }
    },

    listInstances: {
        execute: async () => {
            const data = await ec2.describeInstances().promise();
            return data.Reservations.flatMap(r => 
                r.Instances.map(i => ({
                    instanceId: i.InstanceId,
                    type: i.InstanceType,
                    state: i.State.Name,
                    name: i.Tags.find(t => t.Key === 'Name')?.Value
                }))
            );
        }
    },

    checkInstanceStatus: {
        execute: async (instanceId) => {
            const data = await ec2.describeInstances({ InstanceIds: [instanceId] }).promise();
            const instance = data.Reservations[0].Instances[0];
            return {
                instanceId,
                state: instance.State.Name,
                publicIp: instance.PublicIpAddress
            };
        }
    },



















    
    /**
     * Storage Management Functions
     */
    createBucket: { 
        params: ["string", "string"], 
        execute: async (bucketName, region = 'us-east-1') => {
            const params = {
                Bucket: bucketName,
                CreateBucketConfiguration: {
                    LocationConstraint: region
                }
            };
            
            try {
                const data = await s3.createBucket(params).promise();
                return {
                    bucketName,
                    location: data.Location,
                    message: `Bucket ${bucketName} created in ${region}`
                };
            } catch (err) {
                throw new Error(`AWS Error: ${err.message}`);
            }
        }
    },

    listBuckets: {
        params: [],
        execute: async () => {
            try {
                const data = await s3.listBuckets().promise();
                return {
                    buckets: data.Buckets,
                    count: data.Buckets.length,
                    message: `Found ${data.Buckets.length} buckets`
                };
            } catch (err) {
                throw new Error(`AWS Error: ${err.message}`);
            }
        }
    },

    /**
     * Networking Functions
     */
    createVPC: {
        params: ["string", "string"],
        execute: async (vpcName, cidrBlock = '10.0.0.0/16') => {
            try {
                const vpcData = await ec2.createVpc({ CidrBlock: cidrBlock }).promise();
                const vpcId = vpcData.Vpc.VpcId;
                
                await ec2.createTags({
                    Resources: [vpcId],
                    Tags: [{ Key: 'Name', Value: vpcName }]
                }).promise();
                
                return {
                    vpcId,
                    cidrBlock,
                    message: `VPC ${vpcName} created with CIDR ${cidrBlock}`
                };
            } catch (err) {
                throw new Error(`AWS Error: ${err.message}`);
            }
        }
    },

    /**
     * Database Functions
     */
    createDatabase: {
        params: ["string", "string", "string", "number"],
        execute: async (dbName, engine, instanceClass, storageGB) => {
            const params = {
                DBInstanceIdentifier: dbName,
                Engine: engine,
                DBInstanceClass: instanceClass,
                AllocatedStorage: storageGB,
                MasterUsername: process.env.DB_MASTER_USER || 'admin',
                MasterUserPassword: process.env.DB_MASTER_PASSWORD || 'password',
                BackupRetentionPeriod: 7,
                MultiAZ: false,
                PubliclyAccessible: true
            };
            
            try {
                const data = await rds.createDBInstance(params).promise();
                return {
                    dbName,
                    status: data.DBInstance.DBInstanceStatus,
                    message: `Database ${dbName} is being created`
                };
            } catch (err) {
                throw new Error(`AWS Error: ${err.message}`);
            }
        }
    },

    /**
     * Load Balancing Functions
     */
    createLoadBalancer: {
        params: ["string", "array", "string"],
        execute: async (name, subnetIds, scheme = 'internet-facing') => {
            const params = {
                Name: name,
                Subnets: subnetIds,
                Scheme: scheme,
                Type: 'application'
            };
            
            try {
                const data = await elbv2.createLoadBalancer(params).promise();
                return {
                    arn: data.LoadBalancers[0].LoadBalancerArn,
                    dnsName: data.LoadBalancers[0].DNSName,
                    message: `Load balancer ${name} created`
                };
            } catch (err) {
                throw new Error(`AWS Error: ${err.message}`);
            }
        }
    }
};

module.exports = { awsFunctions };