import React from "react";

const Editor = ({ code, setCode, handleRun }) => {
  return (
    <div className="editor">
      <textarea value={code} onChange={(e) => setCode(e.target.value)} />
      <button onClick={handleRun}>Run</button>
    </div>
  );
};

export default Editor;
