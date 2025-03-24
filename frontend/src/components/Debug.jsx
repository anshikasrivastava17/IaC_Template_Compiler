import React from "react";

function Debug({ tokens, parserOutput }) {
  return (
    <div className="debug">
      <h2>Tokens</h2>
      <pre>{JSON.stringify(tokens, null, 2)}</pre>

      <h2>Parser Output</h2>
      <pre>{parserOutput}</pre>
    </div>
  );
}


export default Debug;
