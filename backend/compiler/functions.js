const functions = {
    // Arithmetic Functions
    add: { params: ["number", "number"] },
    subtract: { params: ["number", "number"] },
    multiply: { params: ["number", "number"] },
    divide: { params: ["number", "number"] },
    modulus: { params: ["number", "number"] },
    power: { params: ["number", "number"] },
    sqrt: { params: ["number"] },
    cubeRoot: { params: ["number"] },
    factorial: { params: ["number"] },
    log: { params: ["number", "number"] },
    exponent: { params: ["number"] },
    round: { params: ["number", "number"] },
    ceil: { params: ["number"] },
    floor: { params: ["number"] },
    abs: { params: ["number"] },

    // Trigonometric Functions
    sine: { params: ["number"] },
    cosine: { params: ["number"] },
    tangent: { params: ["number"] },

    // Utility Functions
    toRadians: { params: ["number"] },
    toDegrees: { params: ["number"] },
    randomNum: { params: ["number", "number"] },
    randomInt: { params: ["number", "number"] },
    max: { params: ["array"] },
    min: { params: ["array"] }, 
    count: { params: ["array"] },
    range: { params: ["array"] },
    uppercase: { params: ["string"] },
    lowercase: { params: ["string"] },

    // Statistical Functions
    mean: { params: ["array"] },
    median: { params: ["array"] },
    mode: { params: ["array"] },
    variance: { params: ["array"] },
    standardDeviation: { params: ["array"] },

    // Compute Management
    createInstance: { params: ["string", "string"] },
    startInstance: { params: ["string"] },
    stopInstance: { params: ["string"] },
    terminateInstance: { params: ["string"] },
    resizeInstance: { params: ["string", "string"] },
    listInstances: { params: [] },
    checkInstanceStatus: { params: ["string"] },

    // Storage Management
    createStorage: { params: ["string", "number"] },
    attachStorage: { params: ["string", "string"] },
    detachStorage: { params: ["string", "string"] },
    createBucket: { params: ["string", "string"] },
    deleteBucket: { params: ["string"] },
    uploadFile: { params: ["string", "string", "string"] },
    listFiles: { params: ["string"] },

    // Networking
    createNetwork: { params: ["string", "string"] },
    assignIp: { params: ["string", "string"] },
    setFirewallRule: { params: ["string", "string"] },
};

module.exports = {functions};
