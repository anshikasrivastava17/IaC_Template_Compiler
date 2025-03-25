const { parseCode } = require("./parser");
const { functions } = require("./functions");

// Function to properly parse array literals from AST
function parseArrayLiteral(arrayStr) {
    try {
        // Extract numbers and separate them properly
        let elements = arrayStr.match(/\d+/g); // Extracts numbers as an array of strings
        if (!elements) return null;

        let parsedArray = elements.map(Number); // Convert extracted numbers to actual numbers
        return parsedArray;
    } catch (error) {
        return null; // Return null if parsing fails
    }
}

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

                if (expectedType === "number") {
                    if (arg.type !== "Number" || isNaN(Number(arg.value))) {
                        errors.push(`❌ Semantic Error: Argument ${index + 1} of '${funcName}' should be a number.`);
                    }
                } else if (expectedType === "string") {
                    if (arg.type !== "String" || typeof arg.value !== "string") {
                        errors.push(`❌ Semantic Error: Argument ${index + 1} of '${funcName}' should be a string.`);
                    }
                } else if (expectedType === "array") {
                    if (arg.type !== "Array") {
                        errors.push(`❌ Semantic Error: Argument ${index + 1} of '${funcName}' should be an array.`);
                    } else {
                        const parsedArray = parseArrayLiteral(arg.value);
                        if (!Array.isArray(parsedArray)) {
                            errors.push(`❌ Semantic Error: Argument ${index + 1} of '${funcName}' is not a valid array.`);
                        }
                    }
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
