const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { tokenize } = require("./compiler/lexer");
const { parseCode } = require("./compiler/parser");

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
    const { code } = req.body;  // Get user input from frontend
    try {
        parseCode(code);  // Run the parser
        res.json({ success: true, message: "Code parsed successfully." });
    } catch (error) {
        res.json({ success: false, errors: error.message.split("\n") });
    }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));