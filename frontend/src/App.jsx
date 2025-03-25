import React, { useState } from "react";
import "./App.css";
import Editor from "./components/Editor";
import Debug from "./components/Debug";
import UserManual from "./components/UserManual";

function App() {
  const [activeTab, setActiveTab] = useState("editor");
  const [code, setCode] = useState("");
  const [tokens, setTokens] = useState([]);
  const [parserOutput, setParserOutput] = useState("");
  const [semanticOutput, setSemanticOutput] = useState("");
  const [error, setError] = useState(null); // Store API errors

  const handleRun = async () => {
    try {
        setError(null);
        setTokens([]);
        setParserOutput("");
        setSemanticOutput("");
        
        // Tokenize
        const tokenResponse = await fetch("http://localhost:3000/tokenize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        });
        const tokenData = await tokenResponse.json();
        setTokens(tokenData.tokens || []);

        // Parse
        const parseResponse = await fetch("http://localhost:3000/parse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        });
        const parseData = await parseResponse.json();
        
        // Update parser output with errors or success message
        setParserOutput(
            parseData.errors?.join("\n") || 
            parseData.result || 
            "Parsing completed successfully.\n" +
            (parseData.consoleOutput?.join("\n") || "")
        );

        // Only do semantic analysis if parsing succeeded
        if (parseData.success) {
            const semanticResponse = await fetch("http://localhost:3000/semantic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const semanticData = await semanticResponse.json();
            setSemanticOutput(
                semanticData.errors?.join("\n") || 
                "Semantic analysis passed."
            );
        } else {
            setSemanticOutput("Skipped semantic analysis due to parser errors");
        }

        setActiveTab("debug");
    } catch (err) {
        console.error("Error running code:", err);
        setParserOutput(`Error: ${err.message}`);
        setSemanticOutput("Analysis failed");
        setActiveTab("debug");
    }
};
  

  return (
    <div className="container">
      {/* Tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab("editor")}>Editor</button>
        <button onClick={() => setActiveTab("debug")}>Debug</button>
        <button onClick={() => setActiveTab("manual")}>User Manual</button>
      </div>

      {/* Render Components Based on Active Tab */}
      {activeTab === "editor" && (
        <Editor code={code} setCode={setCode} handleRun={handleRun}  />
      )}
      {activeTab === "debug" && (
        <Debug tokens={tokens} parserOutput={parserOutput} semanticOutput={semanticOutput} />
      )}
      {activeTab === "manual" && <UserManual />}
    </div>
  );
}

export default App;