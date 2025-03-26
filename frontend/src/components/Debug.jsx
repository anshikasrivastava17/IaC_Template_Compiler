import React from "react";
import { AlignLeft, Code, Search } from "lucide-react";

const Debug = ({ tokens, parserOutput, semanticOutput }) => {
  return (
    <div className="space-y-4">
      {/* Tokens Section */}
      <div className="bg-[#1e293b] p-4 rounded-lg shadow-md">
        <div className="flex items-center mb-3 border-b border-gray-700 pb-2">
          <AlignLeft className="text-blue-400 mr-2" size={20} />
          <h3 className="text-lg font-semibold text-white">Tokens</h3>
        </div>
        <pre className="bg-[#0f172a] p-3 rounded-md text-gray-300 text-sm overflow-x-auto max-h-64 overflow-y-auto">
          {tokens.length > 0 
            ? JSON.stringify(tokens, null, 2) 
            : "No tokens generated"}
        </pre>
      </div>

      {/* Parser Output Section */}
      <div className="bg-[#1e293b] p-4 rounded-lg shadow-md">
        <div className="flex items-center mb-3 border-b border-gray-700 pb-2">
          <Code className="text-green-400 mr-2" size={20} />
          <h3 className="text-lg font-semibold text-white">Parser Output</h3>
        </div>
        <pre className="bg-[#0f172a] p-3 rounded-md text-gray-300 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
          {parserOutput || "No parser output"}
        </pre>
      </div>

      {/* Semantic Output Section */}
      <div className="bg-[#1e293b] p-4 rounded-lg shadow-md">
        <div className="flex items-center mb-3 border-b border-gray-700 pb-2">
          <Search className="text-purple-400 mr-2" size={20} />
          <h3 className="text-lg font-semibold text-white">Semantic Analysis</h3>
        </div>
        <pre className="bg-[#0f172a] p-3 rounded-md text-gray-300 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
          {semanticOutput || "No semantic analysis performed"}
        </pre>
      </div>
    </div>
  );
};

export default Debug;