const { parseCode } = require("./parser");
const { functions } = require("./functions");

function checkSemantics(ast) {
    let errors = [];

    ast.body.forEach(node => {
        if (node.type === "FunctionCall") {
            const funcName = node.name;
            const args = node.args;

            if (!functions[funcName]) {
                errors.push(`❌ Semantic Error: Function '${funcName}' is not defined.`);
                return;
            }

            const expectedParams = functions[funcName].params;
            
            if (args.length !== expectedParams.length) {
                errors.push(`❌ Semantic Error: Function '${funcName}' expects ${expectedParams.length} arguments, but got ${args.length}.`);
            }

            args.forEach((arg, index) => {
                const expectedType = expectedParams[index];
                if (expectedType === "number" && isNaN(Number(arg.value))) {
                    errors.push(`❌ Semantic Error: Argument ${index + 1} of '${funcName}' should be a number.`);
                } else if (expectedType === "string" && typeof arg.value !== "string") {
                    errors.push(`❌ Semantic Error: Argument ${index + 1} of '${funcName}' should be a string.`);
                } else if (expectedType === "array" && !Array.isArray(arg.value)) {
                    errors.push(`❌ Semantic Error: Argument ${index + 1} of '${funcName}' should be an array.`);
                }
            });
        }
    });

    return errors;
}

function analyzeCode(code) {
    const ast = parseCode(code);
    const errors = checkSemantics(ast);

    if (errors.length > 0) {
        return { success: false, errors }; 
    }

    return { success: true, message: "Semantic analysis completed successfully." };
}

module.exports = { analyzeCode };
