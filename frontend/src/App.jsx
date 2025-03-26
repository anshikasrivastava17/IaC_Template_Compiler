import React, { useState } from "react";
import { 
  Code, 
  Terminal, 
  Book, 
  Play, 
  Layers 
} from "lucide-react";
import Editor from "./components/Editor";
import Debug from "./components/Debug";
import UserManual from "./components/UserManual";

function App() {
  const [activeTab, setActiveTab] = useState("editor");
  const [code, setCode] = useState("");
  const [tokens, setTokens] = useState([]);
  const [parserOutput, setParserOutput] = useState("");
  const [semanticOutput, setSemanticOutput] = useState("");
  const [error, setError] = useState(null);

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

  const NavButton = ({ icon: Icon, label, active, onClick }) => (
    <button 
      onClick={onClick}
      className={`
        flex items-center space-x-2 p-3 rounded-lg transition-all duration-300 group
        ${active 
          ? "bg-blue-600 text-white" 
          : "text-gray-400 hover:bg-gray-700 hover:text-white"
        }
      `}
    >
      <Icon size={20} />
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-gray-200">
      {/* Top Navigation Bar */}
      <div className="bg-[#1e293b] shadow-xl flex justify-between items-center px-6 py-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <Code className="text-blue-400" size={32} />
          <h1 className="text-xl font-bold text-white">IaC Template Compiler</h1>
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-4">
          <NavButton 
            icon={Layers} 
            label="Editor" 
            active={activeTab === "editor"}
            onClick={() => setActiveTab("editor")} 
          />
          <NavButton 
            icon={Terminal} 
            label="Debug" 
            active={activeTab === "debug"}
            onClick={() => setActiveTab("debug")} 
          />
          <NavButton 
            icon={Book} 
            label="Manual" 
            active={activeTab === "manual"}
            onClick={() => setActiveTab("manual")} 
          />
        </div>

        {/* Run and Debug Button */}
        <button 
          onClick={handleRun}
          className="
            bg-green-600 text-white px-4 py-2 rounded-lg 
            flex items-center space-x-2 hover:bg-green-700 
            transition-colors duration-300
          "
        >
          <Play size={18} />
          <span>Run & Debug</span>
        </button>
      </div>

      <div className="flex-1 p-6 overflow-auto w-full h-full">
        {activeTab === "editor" && (
          <Editor code={code} setCode={setCode} handleRun={handleRun} />
        )}
        {activeTab === "debug" && (
          <Debug 
            tokens={tokens} 
            parserOutput={parserOutput} 
            semanticOutput={semanticOutput} 
          />
        )}
        {activeTab === "manual" && <UserManual />}
      </div>
    </div>
  );
}

export default App;