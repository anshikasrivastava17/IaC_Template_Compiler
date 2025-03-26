import React from "react";

const Documentation = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-white-500 dark:text-gray-200">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Infrastructure-as-Code (IaC) Language Documentation</h1>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Introduction</h2>
        <p>
          Modern cloud environments rely on Infrastructure-as-Code (IaC) for automated resource provisioning. Existing tools like Terraform and CloudFormation have steep learning curves. This language introduces a simplified, readable, and flexible approach to defining infrastructure. The compiler translates high-level scripts into machine-executable cloud API calls, streamlining deployment and management.
        </p>
      </section>

      {/* Function Categories */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Function Categories</h2>
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800 text-black">


            <tr>
              <th className="border p-2 text-left ">Category</th>
              <th className="border p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Arithmetic Functions", "Used for resource scaling and cost calculations"],
              ["Trigonometric Functions", "Useful for load distribution and periodic resource allocation"],
              ["Utility Functions", "Includes random number generation and string manipulation"],
              ["Statistical Functions", "Helps analyze infrastructure metrics for decision-making and monitoring"],
              ["Compute Management", "Create, start, stop, and manage compute instances"],
              ["Storage Management", "Manage storage volumes and cloud buckets"],
              ["Networking Functions", "Configure networks, assign IPs, and set firewall rules"]
            ].map(([category, description], index) => (
              <tr key={index}>
                <td className="border p-2">{category}</td>
                <td className="border p-2">{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Token Categories */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Token Categories</h2>
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 text-black">

            <tr>
              <th className="border p-2 text-left">Token Type</th>
              <th className="border p-2 text-left">Example</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Keyword", "CREATE, DELETE, ATTACH"],
              ["Operator", "+, -, *, /, % ,>=, <=, == , <>"],
              ["Constant", "5, 3.14"],
              ["Identifier", "Variable and function names"],
              ["Special Character", "( ), { }, [ ], ;"],
              ["Comment", "Single-line: ?!? this is a comment, Multi-line: ?!?* comment block *?!?"],
              ["Delimeter", "( , ) , { , } , , , ; "],
              ["Array Literal", "[ ]"],
              ["String", "sample string"]
            ].map(([type, example], index) => (
              <tr key={index}>
                <td className="border p-2">{type}</td>
                <td className="border p-2">{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Error Handling */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Error Handling</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Mismatched Arguments:</b> Ensures correct number/type of arguments</li>
          <li><b>Unexpected Delimeter:</b> Detects missing semicolon at EOF</li>
          <li><b>Invalid Function Calls:</b> Prevents misuse of reserved words</li>
        </ul>
      </section>

      {/* Example Errors */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Invalid Syntax Examples</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm">
          {[
            "ADD = 5; // ❌ 'ADD' is a reserved keyword",
            "int x = 5 // ❌ Missing semicolon",
            "add 3 , num ; // ❌ Expected argument Integer but got String"
          ].map((error, index) => (
            <code key={index} className="block text-red-500">{error}</code>
          ))}
        </div>
      </section>

      {/* Function Reference */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Function References</h2>
        
        {/* Arithmetic Functions */}
        <h3 className="text-lg font-semibold mt-4">Arithmetic Functions</h3>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm space-y-2 text-black">
          <code>function add(a, b) - Returns the sum of two numbers<br /></code>
          <code>function subtract(a, b) - Returns the difference between two numbers<br /></code>
          <code>function multiply(a, b) - Returns the product of two numbers<br /></code>
          <code>function divide(a, b) - Returns the quotient of two numbers<br /></code>
          <code>function modulus(a, b) - Returns the remainder of division<br /></code>
          <code>function power(base, exponent) - Raises base to the power of exponent<br /></code>
          <code>function sqrt(a) - Returns the square root of a number<br /></code>
          <code>function cubeRoot(number) - Returns the cube root of a number<br /></code>
          <code>function factorial(number) - Returns the factorial of a number<br /></code>
          <code>function log(base, value) - Returns the logarithm of value with given base<br /></code>
          <code>function exponent(value) - Returns e raised to the power of value<br /></code>
          <code>function round(value, decimals = 0) - Rounds a number to specified decimals<br /></code>
          <code>function ceil(value) - Rounds a number up to the nearest integer<br /></code>
          <code>function floor(value) - Rounds a number down to the nearest integer<br /></code>
          <code>function abs(value) - Returns the absolute value of a number<br /></code>
        </div>

        {/* Trigonometric Functions */}
        <h3 className="text-lg font-semibold mt-4">Trigonometric Functions</h3>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm space-y-2 text-black">
          <code>function sine(angleInDegrees) - Returns the sine of an angle in degrees<br /></code>
          <code>function cosine(angleInDegrees) - Returns the cosine of an angle in degrees<br /></code>
          <code>function tangent(angleInDegrees) - Returns the tangent of an angle in degrees<br /></code>
        </div>

        {/* Utility Functions */}
        <h3 className="text-lg font-semibold mt-4">Utility Functions</h3>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm space-y-2 text-black">
          <code>function toRadians(degrees) - Converts degrees to radians<br /></code>
          <code>function toDegrees(Radian) - Converts radians to degrees<br /></code>
          <code>function randomNum(min = 0, max = 1) - Returns a random float between min and max<br /></code>
          <code>function randomInt(min, max) - Returns a random integer between min and max<br /></code>
          <code>function max(data) - Returns the maximum value in an array<br /></code>
          <code>function min(data) - Returns the minimum value in an array<br /></code>
          <code>function count(data) - Returns the number of elements in an array<br /></code>
          <code>function range(data) - Returns the range (max-min) of values in an array<br /></code>
          <code>function uppercase(input) - Converts a string to uppercase<br /></code>
          <code>function lowercase(input) - Converts a string to lowercase<br /></code>
        </div>

        {/* Statistical Functions */}
        <h3 className="text-lg font-semibold mt-4">Statistical Functions</h3>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm space-y-2 text-black">
          <code>function mean(values) - Calculates the average of values<br /></code>
          <code>function median(values) - Finds the middle value in a sorted array<br /></code>
          <code>function mode(data) - Finds the most frequently occurring value<br /></code>
          <code>function variance(values) - Calculates variance of a dataset<br /></code>
          <code>function standardDeviation(values) - Calculates standard deviation<br /></code>
        </div>

        {/* Compute Management */}
        <h3 className="text-lg font-semibold mt-4">Compute Management</h3>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm space-y-2 text-black">
          <code>function createInstance(name, type) - Creates a new compute instance<br /></code>
          <code>function startInstance(name) - Starts an existing instance<br /></code>
          <code>function stopInstance(name) - Stops a running instance<br /></code>
          <code>function terminateInstance(name) - Permanently deletes an instance<br /></code>
          <code>function resizeInstance(name, newType) - Changes instance type/size<br /></code>
          <code>function listInstances() - Lists all active instances<br /></code>
          <code>function checkInstanceStatus(instanceName) - Checks instance status<br /></code>
        </div>

        {/* Storage Management */}
        <h3 className="text-lg font-semibold mt-4">Storage Management</h3>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm space-y-2 text-black">
          <code>function createStorage(name, size) - Creates a new storage volume<br /></code>
          <code>function attachStorage(instanceName, storageName) - Attaches storage to instance<br /></code>
          <code>function detachStorage(instanceName, storageName) - Detaches storage from instance<br /></code>
          <code>function createBucket(name, region) - Creates cloud storage bucket<br /></code>
          <code>function deleteBucket(name) - Deletes a storage bucket<br /></code>
          <code>function uploadFile(bucketName, fileName, path) - Uploads file to bucket<br /></code>
          <code>function listFiles(bucketName) - Lists files in a bucket<br /></code>
        </div>

        {/* Networking */}
        <h3 className="text-lg font-semibold mt-4">Networking</h3>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm space-y-2 text-black">
          <code>function createNetwork(name, cidrBlock) - Creates virtual network<br /></code>
          <code>function assignIp(instanceName, ipAddress) - Assigns static IP to instance<br /></code>
          <code>function setFirewallRule(networkName, rule) - Configures firewall rules<br /></code>
        </div>
      </section>

      {/* Conclusion */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Conclusion</h2>
        <p>
          This IaC language and compiler simplify cloud automation with a readable, structured approach. By directly generating API calls, it bypasses Terraform and CloudFormation, making deployment faster and more efficient.
        </p>
      </section>
    </div>
  );
};

export default Documentation;