import { useState } from "react";

const Editor = ({ code, setCode, handleRun }) => {
  const [output, setOutput] = useState("");

  const handleExecute = async () => {
    try {
      const response = await fetch("http://localhost:3000/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
       // Ensure output is an array
       setOutput(Array.isArray(data.result) ? data.result : [{ function: "Error", result: data.error || "Execution failed" }]);
      } catch (error) {
        setOutput([{ function: "Error", result: "Error executing function" }]);
      }
    };
  
    return (
      <div className="editor">
        <textarea value={code} onChange={(e) => setCode(e.target.value)} />
        <div className="buttons">
          <button onClick={handleRun}>Run</button>
          <button onClick={handleExecute}>Execute</button>
        </div>
  
        {output.length > 0 && (
          <div className="output">
            {output.map((item, index) => (
              <div key={index}>
                <p><strong>Function:</strong> {item.function}</p>
                <p><strong>Result:</strong> {item.result}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default Editor;