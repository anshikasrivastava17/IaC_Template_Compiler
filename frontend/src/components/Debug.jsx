import React from "react";

const Debug = ({ tokens, parserOutput, semanticOutput }) => {
  return (
    <div>
      <h3>Tokens</h3>
      <pre>{JSON.stringify(tokens, null, 2)}</pre>

      <h3>Parser Output</h3>
      <pre>{parserOutput}</pre>

      <h3>Semantic Output</h3>
      <pre>{semanticOutput}</pre>
    </div>
  );
};

export default Debug;