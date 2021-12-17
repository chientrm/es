export const CHARS = {
  SPACE: 0,
  DIGIT: 1,
  OPERATOR: 2,
  BRACKET: 3,
  QUOTE: 4,
  NAME: 5,
};

export const TOKENS = {
  NUMBER: 0,
  OPERATOR: 1,
  BRACKET: 2,
  STRING: 3,
  NAME: 4,
};

const charsets = [
  { set: "\r\n\t\f ;,:?\\#@$", value: CHARS.SPACE },
  { set: "!%^&*-+=|~/<>", value: CHARS.OPERATOR },
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
  ...charsets,
];

const tokensets = {
  [CHARS.DIGIT]: TOKENS.NUMBER,
  [CHARS.OPERATOR]: TOKENS.OPERATOR,
  [CHARS.BRACKET]: TOKENS.BRACKET,
  [CHARS.QUOTE]: TOKENS.STRING,
  [CHARS.NAME]: TOKENS.NAME,
};

export const e_token_type = (t) => tokensets[e_char_type(t[0], charsets2)];
