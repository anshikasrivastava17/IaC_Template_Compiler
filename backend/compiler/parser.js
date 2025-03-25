const { tokenize } = require("./lexer");
const { keywordMappings, getKeyword } = require("./keywords");

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
            else if (nextToken.value === ",") {
                this.consume(); // Skip comma
                continue;
            } 
            else if (nextToken.type === "DELIMITER" && nextToken.value === ";") {
                this.consume(); // Consume semicolon and break
                break;
            } 
            else {
                this.error(`Unexpected token '${nextToken.value}' in argument list.`);
                this.consume();
            }
        }

        return args;
    }

    handleKeyword(token) {
        // Check if keyword is used in assignment (e.g., "add = 4;")
        if (this.peek()?.value === "=") {
            this.error(`Keyword '${token.value}' cannot be used as an identifier.`);
            return;
        }

        let args = this.parseArguments();
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

module.exports = { parseCode };
