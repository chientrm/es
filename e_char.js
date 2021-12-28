export const CHARS = {
  SPACE: 0,
  DIGIT: 1,
  OPERATOR: 2,
  BRACKET: 3,
  BRACKET_CLOSE: 4,
  QUOTE: 5,
  NAME: 6,
};

export const TOKENS = {
  NUMBER: 0,
  OPERATOR: 1,
  BRACKET_CLOSE: 2,
  STRING: 3,
  NAME: 4,
};

const charsets = [
  { set: "\r\n\t\f ;,:?\\#@$", value: CHARS.SPACE },
  { set: "!%^&*-+=|~/<>.", value: CHARS.OPERATOR },
  { set: "[]{}()", value: CHARS.BRACKET },
  { set: "'\"", value: CHARS.QUOTE },
  { set: undefined, value: CHARS.NAME },
];

export const e_char_type = (c, _charsets = charsets) =>
  _charsets.find((charset) => !charset.set || charset.set.includes(c)).value;

const charsets2 = [
  {
    set: "1234567890",
    value: CHARS.DIGIT,
  },
  {
    set: "]})",
    value: CHARS.BRACKET_CLOSE,
  },
  ...charsets,
];

const tokensets = {
  [CHARS.DIGIT]: TOKENS.NUMBER,
  [CHARS.OPERATOR]: TOKENS.OPERATOR,
  [CHARS.BRACKET_CLOSE]: TOKENS.BRACKET_CLOSE,
  [CHARS.QUOTE]: TOKENS.STRING,
  [CHARS.NAME]: TOKENS.NAME,
};

export const e_token_type = (t) => {
  if (["instanceof", "in"].includes(t)) return TOKENS.OPERATOR;
  return tokensets[e_char_type(t[0], charsets2)];
};
