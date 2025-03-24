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
};

const operators = ["+", "-", "*", "/", "%", "=", "==", "!=", ">", "<", ">=", "<="];
const delimiters = ["(", ")", "{", "}", "[", "]", ",", ";"];

const patterns = {
  number: /^[0-9]+(\.[0-9]+)?$/,
  identifier: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
  string: /^"([^"]*)"|^'([^']*)'/,  // ✅ Detects "string" and 'string'
  commentSingle: /^\?!?.*$/,  // Single-line comment ?!?
  commentMultiStart: /^\?!?\*.*$/,  // Multi-line start ?!?*
  commentMultiEnd: /^.*\*?!?$/,  // Multi-line end *?!?
};

function tokenize(code) {
  const tokens = [];
  const lines = code.split("\n");
  let inMultilineComment = false;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (inMultilineComment) {
      tokens.push({ type: tokenTypes.COMMENT, value: line });
      if (patterns.commentMultiEnd.test(line)) inMultilineComment = false;
      continue;
    }
    if (patterns.commentMultiStart.test(line)) {
      inMultilineComment = true;
      tokens.push({ type: tokenTypes.COMMENT, value: line });
      continue;
    }

    if (patterns.commentSingle.test(line)) {
      tokens.push({ type: tokenTypes.COMMENT, value: line });
      continue;
    }

    const words = line.split(/\s+/);
    let previousToken = null;

    for (let i = 0; i < words.length; i++) {
      let word = words[i];

      if (keywordMappings.hasOwnProperty(getKeyword(word))) {
        tokens.push({ type: tokenTypes.KEYWORD, value: word });
      } else if (operators.includes(word)) {
        tokens.push({ type: tokenTypes.OPERATOR, value: word });

        // Check if '=' is followed by a valid identifier, number, or string
        if (word === "=") {
          const nextWord = words[i + 1];
          if (!nextWord || (!patterns.identifier.test(nextWord) && !patterns.number.test(nextWord) && !/^".*"$/.test(nextWord))) {
            throw new Error(`Parsing Error at token '${word}': Expected a value or identifier after '='.`);
          }
        }

      } else if (delimiters.includes(word)) {
        tokens.push({ type: tokenTypes.DELIMITER, value: word });
      } else if (patterns.number.test(word)) {
        tokens.push({ type: tokenTypes.CONSTANT, value: word });
      } else if (patterns.identifier.test(word)) {
        tokens.push({ type: tokenTypes.IDENTIFIER, value: word });
      } else if (/^".*"$/.test(word)) {
        tokens.push({ type: tokenTypes.STRING, value: word });
      } else {
        throw new Error(`Parsing Error at token '${word}': Unexpected token.`);
      }

      previousToken = tokens[tokens.length - 1];
    }
  }

  return tokens;
}


module.exports = { tokenize };
