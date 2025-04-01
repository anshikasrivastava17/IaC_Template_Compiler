const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { tokenize } = require("./compiler/lexer");
const { Parser, parseCode } = require("./compiler/parser");
const { analyzeCode } = require("./compiler/semantic");
const { executeAST } = require("./compiler/executor");
const app = express();
app.use(cors());
app.use(bodyParser.json());


app.post("/tokenize", (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: "Code is required" });
    }
    try {
        const tokens = tokenize(code);
        res.json({ tokens });
    } catch (error) {
        res.status(500).json({ error: "Error tokenizing code" });
    }
});


app.post("/parse", (req, res) => {
    const { code } = req.body;
    try {
        const tokens = tokenize(code);
        const parser = new Parser(tokens);
        const ast = parser.parse();
        
        // Return both AST and errors (if any)
        res.json({ 
            success: parser.errors.length === 0,
            ast: ast, // Keep the AST in response
            errors: parser.errors,
            result: parser.errors.length > 0 
                ? "Parsing completed with errors" 
                : "Parsing completed successfully",
            consoleOutput: [
                `🔹 Tokenized Output: ${JSON.stringify(tokens, null, 2)}`,
                `🔹 Generated AST: ${JSON.stringify(ast, null, 2)}`
            ]
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            errors: [error.message],
            result: "Parsing failed"
        });
    }
});


app.post("/semantic", (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: "Code is required" });
    }
    
    const result = analyzeCode(code);

    if (!result.success) {
        return res.status(400).json({ errors: result.errors }); 
    }

    res.json({ message: result.message });
});


app.post("/execute", async(req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: "No code provided" });

        const result = await executeAST(code); // ✅ Run AST execution
        return res.json({ success: true, result });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));