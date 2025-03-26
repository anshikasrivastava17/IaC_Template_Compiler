const functions = {
    // Arithmetic Functions
    add: { params: ["number", "number"], execute: (a, b) => a + b },
    subtract: { params: ["number", "number"], execute: (a, b) => a - b },
    multiply: { params: ["number", "number"], execute: (a, b) => a * b },
    divide: { params: ["number", "number"], execute: (a, b) => (b !== 0 ? a / b : "Error: Division by zero") },
    modulus: { params: ["number", "number"], execute: (a, b) => a % b },
    power: { params: ["number", "number"], execute: (a, b) => Math.pow(a, b) },
    sqrt: { params: ["number"], execute: (a) => Math.sqrt(a) },
    cubeRoot: { params: ["number"], execute: (a) => Math.cbrt(a) },
    factorial: { params: ["number"], execute: (a) => (a < 0 ? "Error: Negative factorial" : factorial(a)) },
    log: { params: ["number", "number"], execute: (a, b) => Math.log(a) / Math.log(b) },
    exponent: { params: ["number"], execute: (a) => Math.exp(a) },
    round: { params: ["number", "number"], execute: (a, b) => parseFloat(a.toFixed(b)) },
    ceil: { params: ["number"], execute: (a) => Math.ceil(a) },
    floor: { params: ["number"], execute: (a) => Math.floor(a) },
    absolute: { params: ["number"], execute: (a) => Math.abs(a) },

    // Trigonometric Functions
    sine: { params: ["number"], execute: (a) => Math.sin(a) },
    cosine: { params: ["number"], execute: (a) => Math.cos(a) },
    tangent: { params: ["number"], execute: (a) => Math.tan(a) },

    // Utility Functions
    toRadians: { params: ["number"], execute: (a) => (a * Math.PI) / 180 },
    toDegrees: { params: ["number"], execute: (a) => (a * 180) / Math.PI },
    randomNum: { params: ["number", "number"], execute: (min, max) => Math.random() * (max - min) + min },
    randomInt: { params: ["number", "number"], execute: (min, max) => Math.floor(Math.random() * (max - min + 1) + min) },

    // Array-based Functions
    max: { params: ["array"], execute: (arr) => Math.max(...arr) },
    min: { params: ["array"], execute: (arr) => Math.min(...arr) },
    count: { params: ["array"], execute: (arr) => arr.length },
    range: { params: ["array"], execute: (arr) => Math.max(...arr) - Math.min(...arr) },

    // String Functions
    uppercase: { params: ["string"], execute: (str) => str.toUpperCase() },
    lowercase: { params: ["string"], execute: (str) => str.toLowerCase() },

    // Statistical Functions
    mean: { params: ["array"], execute: (arr) => arr.reduce((a, b) => a + b, 0) / arr.length },
    median: { params: ["array"], execute: (arr) => {
        arr.sort((a, b) => a - b);
        const mid = Math.floor(arr.length / 2);
        return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
    }},
    mode: { params: ["array"], execute: (arr) => {
        const freqMap = {};
        arr.forEach(num => freqMap[num] = (freqMap[num] || 0) + 1);
        const maxFreq = Math.max(...Object.values(freqMap));
        return Object.keys(freqMap).filter(num => freqMap[num] === maxFreq).map(Number);
    }},
    variance: { params: ["array"], execute: (arr) => {
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        return arr.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / arr.length;
    }},
    standardDeviation: { params: ["array"], execute: (arr) => Math.sqrt(functions.variance.execute(arr)) },








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

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

module.exports = {functions};
