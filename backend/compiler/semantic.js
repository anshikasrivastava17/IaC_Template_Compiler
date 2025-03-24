const { functions } = require("./functions");

function analyzeSemantics(ast) {
    console.log("🔎 Starting semantic analysis...");
    let errors = [];

    ast.forEach(node => {
        if (node.type === "FunctionCall") {
            // Check if the function is defined
            if (!functions[node.name]) {
                errors.push(`Semantic Error: Function '${node.name}' is not defined.`);
                return;
            }

            let expectedParams = functions[node.name].params;
            if (node.arguments.length !== expectedParams.length) {
                errors.push(`Semantic Error: Function '${node.name}' expects ${expectedParams.length} arguments, but got ${node.arguments.length}.`);
            }

            // Ensure argument types match the expected types
            node.arguments.forEach((arg, idx) => {
                let expectedType = expectedParams[idx];
                if (!isValidType(arg, expectedType)) {
                    errors.push(`Semantic Error: Argument '${arg}' at position ${idx + 1} in function '${node.name}' is of invalid type. Expected ${expectedType}.`);
                }
            });
        }
    });

    if (errors.length > 0) {
        console.error("❌ Semantic Errors:", errors.join("\n"));
        throw new Error(errors.join("\n"));
    }

    console.log("✅ Semantic analysis completed successfully.");
}

function isValidType(value, expectedType) {
    // Check if the value matches the expected type
    switch (expectedType) {
        case "string":
            return typeof value === "string";
        case "identifier":
            return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value);
        case "constant":
            return /^[0-9]+(\.[0-9]+)?$/.test(value); // Simple number regex check
        default:
            return false;
    }
}

module.exports = { analyzeSemantics };
