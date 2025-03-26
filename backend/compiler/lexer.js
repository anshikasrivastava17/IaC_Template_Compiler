const { keywordMappings, getKeyword } = require("./keywords.js");

const tokenTypes = {
  KEYWORD: "KEYWORD",
  OPERATOR: "OPERATOR",
  CONSTANT: "CONSTANT",
  IDENTIFIER: "IDENTIFIER",
  STRING: "STRING",
  SPECIAL_CHAR: "SPECIAL_CHAR",
  COMMENT: "COMMENT",
  DELIMITER: "DELIMITER",
  ARRAY_LITERAL: "ARRAY_LITERAL"
};

const operators = ["+", "-", "*", "/", "%", "=", "==", "!=", ">", "<", ">=", "<="];
const delimiters = ["(", ")", "{", "}", ",", ";"];

const patterns = {
  number: /^[0-9]+(\.[0-9]+)?$/, 
  identifier: /^[a-zA-Z_][a-zA-Z0-9_]*$/, 
  string: /^"([^"]*)"|^'([^']*)'/, 
  commentSingle: /^\?!?.*$/, 
  commentMultiStart: /^\?!?\*.*$/, 
  commentMultiEnd: /^.*\*?!?$/
};

function tokenize(code) {
  const tokens = [];
  const lines = code.split("\n");
  let inMultilineComment = false;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    console.log(`Processing line: "${line}"`);

    if (inMultilineComment) {
      tokens.push({ type: tokenTypes.COMMENT, value: line });
      if (/^.*\*?!?$/.test(line)) inMultilineComment = false;
      continue;
    }
    if (/^\?!?\*.*$/.test(line)) {
      inMultilineComment = true;
      tokens.push({ type: tokenTypes.COMMENT, value: line });
      continue;
    }
    if (/^\?!?.*$/.test(line)) {
      tokens.push({ type: tokenTypes.COMMENT, value: line });
      continue;
    }

    let buffer = "";
    let insideArray = false;
    
    const words = line.split(/\s+/);
    
    for (let i = 0; i < words.length; i++) {
      let word = words[i];

      console.log(`Checking word: "${word}"`);

      
      if (insideArray) {
        buffer += " " + word;
        if (word.endsWith("]")) {
          insideArray = false;
          tokens.push({ type: tokenTypes.ARRAY_LITERAL, value: buffer.trim() });
          console.log(`Detected negative number: "${word + words[i + 1]}"`);
        }
        continue;
      }
      
      if (word.startsWith("[")) {
        buffer = word;
        insideArray = !word.endsWith("]");
        if (!insideArray) {
          tokens.push({ type: tokenTypes.ARRAY_LITERAL, value: buffer.trim() });
        }
        continue;
      }
      
      if (word.startsWith("-") && patterns.number.test(word.slice(1))) {
        tokens.push({ type: tokenTypes.CONSTANT, value: word });
        console.log(`Detected negative number: "${word}"`);
      } 
      else if (keywordMappings.hasOwnProperty(getKeyword(word))) {
        tokens.push({ type: tokenTypes.KEYWORD, value: word });
      } else if (operators.includes(word)) {
        tokens.push({ type: tokenTypes.OPERATOR, value: word });
      } else if (delimiters.includes(word)) {
        tokens.push({ type: tokenTypes.DELIMITER, value: word });
      } else if (patterns.number.test(word)) {
        tokens.push({ type: tokenTypes.CONSTANT, value: word });
      } else if (patterns.identifier.test(word)) {
        tokens.push({ type: tokenTypes.IDENTIFIER, value: word });
      } else if (/^".*"$/.test(word) || /^'.*'$/.test(word)) {
        tokens.push({ type: tokenTypes.STRING, value: word });
      } else {
        throw new Error(`Parsing Error at token '${word}': Unexpected token.`);
      }
    }
  }
  return tokens;
}

module.exports = { tokenize };
