const { parseCode } = require("./parser"); // Import AST generator
const { functions } = require("./functions"); // Import function implementations

// Function to execute AST dynamically
function executeAST(code) {
    // ✅ Generate AST from user-provided code
    const ast = parseCode(code);
    console.log("\n🔹 Generated AST:", JSON.stringify(ast, null, 2));

    if (!ast || ast.type !== "Program") {
        throw new Error("Invalid AST format");
    }

    const results = [];

    for (const statement of ast.body) {
        if (statement.type === "FunctionCall") {
            const functionName = statement.name;

            if (!functions[functionName]) {
                throw new Error(`Unknown function: ${functionName}`);
            }

            // Convert AST arguments into actual values
            const rawArgs = statement.args.map(arg => processASTArgument(arg));

            // Retrieve and execute the function
            const func = functions[functionName].execute;
            const result = func(...rawArgs);

            results.push({ function: functionName, result });
        }
    }

    return results;
}

// Helper function to process AST arguments
function processASTArgument(arg) {
    if (arg.type === "Number") return Number(arg.value);
    if (arg.type === "String") return arg.value;
    if (arg.type === "Array") {
        // Convert space-separated array to an actual array
        return arg.value.replace(/\[|\]/g, "").trim() // Remove square brackets
                        .split(/\s+/)  // Split by spaces
                        .map(Number);  // Convert to numbers
    }
    throw new Error(`Unsupported AST argument type: ${arg.type}`);
}


module.exports = { executeAST };