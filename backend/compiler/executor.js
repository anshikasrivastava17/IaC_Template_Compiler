const { parseCode } = require("./parser"); // Import AST generator
const { functions } = require("./functions"); // Import function implementations
const { awsFunctions } = require("./infra");
const allFunctions = { ...functions, ...awsFunctions };

// Function to execute AST dynamically
async function executeAST(code) {
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

            if (!allFunctions[functionName]) {
                throw new Error(`Unknown function: ${functionName}`);
            }

            // Convert AST arguments into actual values
            const rawArgs = statement.args.map(arg => processASTArgument(arg));

            // Retrieve and execute the function
            const func = allFunctions[functionName].execute;
            try {
                // Handle both sync and async functions
                const result = func.constructor.name === 'AsyncFunction' 
                    ? await func(...rawArgs) 
                    : func(...rawArgs);
                
                results.push({ function: functionName, result });
            } catch (err) {
                results.push({ 
                    function: functionName, 
                    error: err.message,
                    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
                });
            }
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