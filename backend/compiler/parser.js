const { tokenize } = require("./lexer");
const { keywordMappings, getKeyword } = require("./keywords");

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
        this.errors = [];
    }

    error(message) {
        const token = this.peek();
        const errorMsg = `Parsing Error at token '${token?.value || "EOF"}': ${message}`;
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

    handleKeyword(token) {
        let args = [];
        let nextToken = this.peek();

        while (nextToken && nextToken.type !== "DELIMITER") {
            if (nextToken.type === "IDENTIFIER" || nextToken.type === "CONSTANT") {
                args.push(nextToken.value);
                this.consume();
            } else if (nextToken.value === ",") {
                this.consume(); // Skip comma
            } else {
                this.error(`Unexpected token '${nextToken.value}' in function call '${token.value}'.`);
                this.consume();
            }
            nextToken = this.peek();
        }

        if (args.length === 0) {
            this.error(`Expected at least one argument for '${token.value}'.`);
        }

        if (!this.match("DELIMITER")) {
            this.error(`Missing ';' at the end of '${token.value}' statement.`);
        }

        console.log(`✅ Parsed function call: ${token.value}(${args.join(", ")})`);
    }

    variableDeclaration() {
        let nameToken = this.consume();
    
        if (!nameToken || nameToken.type !== "IDENTIFIER") {
            this.error("Expected an identifier for variable declaration.");
            return;
        }
    
        if (this.match("OPERATOR")) { // Checks if '=' is present
            let valueToken = this.peek(); // Peek at the next token without consuming
    
            if (!valueToken || (valueToken.type !== "STRING" && valueToken.type !== "IDENTIFIER" && valueToken.type !== "CONSTANT")) {
                this.error("Expected a value or identifier after '='.");
            } else {
                this.consume(); // Consume the valid value token
            }
        }
    
        if (!this.match("DELIMITER")) {  
            this.error("Missing ';' at the end of the statement.");
        }
    
        console.log(`✅ Parsed variable declaration: ${nameToken.value}`);
    }
    

    parse() {
        console.log("📌 Starting parsing process...");
        while (!this.isAtEnd()) {
            let token = this.peek();

            if (token.type === "KEYWORD") {
                console.log(`🔍 Found keyword: ${token.value}`);

                if (this.peek(1)?.value === "=") {
                    this.error(`Invalid use of keyword '${token.value}' as an identifier.`);

                    while (!this.isAtEnd() && this.peek()?.value !== ";") {
                        this.consume();
                    }

                    this.consume(); // Consume ';' if present
                    continue;
                }

                this.consume(); // Consume the keyword
                this.handleKeyword(token); // Handle function calls
            } 
            
            else if (token.type === "IDENTIFIER") {
                this.variableDeclaration(); // Handle variable declaration
            } 
            
            else {
                this.consume();
            }
        }
        console.log("✅ Parsing completed successfully.");
        return this.errors;
    }
}

function parseCode(code) {
    const tokens = tokenize(code);
    console.log("🔹 Tokenized Output:", tokens);
    const parser = new Parser(tokens);
    const errors = parser.parse();

    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }
}

module.exports = { parseCode };