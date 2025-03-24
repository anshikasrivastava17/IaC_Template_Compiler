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
  const [error, setError] = useState(null); // Store API errors

  const handleRun = async () => {
    try {
      setError(null); // Reset previous errors
  
      // ✅ Tokenize Code
      const tokenResponse = await fetch("http://localhost:3000/tokenize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
  
      if (!tokenResponse.ok) {
        throw new Error(`Tokenization failed: ${tokenResponse.statusText}`);
      }
  
      const tokenData = await tokenResponse.json();
      setTokens(tokenData.tokens || []);
  
      // ✅ Parse Code
      const parseResponse = await fetch("http://localhost:3000/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
  
      const parseData = await parseResponse.json();
  
      // ✅ Check if the response contains errors
      if (parseData.errors && parseData.errors.length > 0) {
        const errorMessages = parseData.errors.join("\n"); // Format errors properly
        setParserOutput(errorMessages); // Display errors in UI
      } else {
        setParserOutput(parseData.result || "Parsing completed successfully.");
      }
  
      // ✅ Switch to Debug tab
      setActiveTab("debug");
    } catch (err) {
      console.error("Error running code:", err);
      setParserOutput(`Error: ${err.message}`); // Show error in Debug tab
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
        <Editor code={code} setCode={setCode} handleRun={handleRun} />
      )}
      {activeTab === "debug" && (
        <Debug tokens={tokens} parserOutput={parserOutput} />
      )}
      {activeTab === "manual" && <UserManual />}
    </div>
  );
}

export default App;