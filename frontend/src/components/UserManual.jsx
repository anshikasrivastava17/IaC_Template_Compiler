import React from "react";

const UserManual = () => {
  return (
    <div className="manual">
      <h3>📖 User Manual</h3>
      <p>Welcome to the Tokenizer! Here’s how to use it:</p>
      <ul>
        <li>💡 <b>Editor:</b> Type or paste your code in the text area.</li>
        <li>⚡ <b>Tokenize:</b> Click the "Tokenize" button to process the input.</li>
        <li>🔍 <b>Debug:</b> View the tokenized output with token types.</li>
        <li>📝 <b>Comments:</b> Use <code>?!?</code> for single-line comments.</li>
        <li>📌 <b>Multi-line Comments:</b> Wrap text between <code>?!* ... *!?</code>.</li>
        <li>🎯 <b>Keywords:</b> All predefined keywords must be uppercase.</li>
      </ul>
      <p>Have fun coding! 🚀</p>
    </div>
  );
};

export default UserManual;
