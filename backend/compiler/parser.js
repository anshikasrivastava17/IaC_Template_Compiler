const { tokenize } = require("./lexer");

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
        this.errors = [];
        this.ast = { type: "Program", body: [] };
    }

    error(message) {
        const token = this.peek();
        const errorMsg = `❌ Parsing Error at token '${token?.value || "EOF"}': ${message}`;
        console.error(errorMsg);
        this.errors.push(errorMsg);
    }

    peek(offset = 0) {
        return this.tokens[this.current + offset] || null;
    }

    consume() {
        return this.tokens[this.current++] || null;
    }

    isAtEnd() {
        return this.current >= this.tokens.length;
    }

    match(type) {
        if (this.isAtEnd()) return false;
        if (this.peek().type === type) {
            this.consume();
            return true;
        }
        return false;
    }

    parseArguments() {
        let args = [];
        while (!this.isAtEnd()) {
            let nextToken = this.peek();
            
            if (nextToken.type === "CONSTANT" || nextToken.type === "IDENTIFIER" || nextToken.type === "STRING") {
                args.push({
                    type: nextToken.type === "CONSTANT" ? "Number" : "String",
                    value: nextToken.value
                });
                this.consume();
            } 
            else if (nextToken.type === "ARRAY_LITERAL") {  // ✅ Handling Array Literal
                args.push({
                    type: "Array",
                    value: nextToken.value
                });
                this.consume();
            } 
            else if (nextToken.value === ",") {
                this.consume(); // Skip comma
            } 
            else {
                break; // Stop at any non-argument token (including semicolons)
            }
        }
        return args;
    }

    handleKeyword(token) {
        if (this.peek()?.value === "=") {
            this.error(`Keyword '${token.value}' cannot be used as an identifier`);
            return;
        }

        const args = this.parseArguments(); // Parse function arguments

        // ✅ Ensure semicolon is expected at the end, not after function name
        if (!this.match("DELIMITER") || this.peek(-1)?.value !== ";") {
            this.error(`Expected semicolon at the end of '${token.value}' statement`);
        }

        this.ast.body.push({
            type: "FunctionCall",
            name: token.value,
            args: args
        });
    }

    parse() {
        console.log("📌 Starting parsing process...");
        while (!this.isAtEnd()) {
            let token = this.peek();

            if (token.type === "KEYWORD") {
                this.consume();
                this.handleKeyword(token);
            } 
            else {
                this.consume();
            }
        }
        console.log("✅ Parsing completed successfully.");
        console.log("🔹 Generated AST:", JSON.stringify(this.ast, null, 2));
        return this.ast;
    }
}

function parseCode(code) {
    const tokens = tokenize(code);
    console.log("🔹 Tokenized Output:", tokens);
    const parser = new Parser(tokens);
    return parser.parse();
}

module.exports = { 
    parseCode,
    Parser 
};
