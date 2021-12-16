export const CHARS = {
  SPACE: 0,
  NAME: 1,
  LATIN: 2,
  DIGIT: 3,
  OPERATOR: 4,
  BRACKET: 5,
  QUOTE: 6,
  UNKNOWN: 7,
};

export const TOKENS = {
  NUMBER: 0,
  NAME: 1,
  OPERATOR: 2,
  BRACKET: 3,
  STRING: 4,
  UNKNOWN: 5,
};

const charsets = [
  { set: "\r\n\t\f ;,:?\\#@$", value: CHARS.SPACE },
  {
    set: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ._1234567890",
    value: CHARS.NAME,
  },
  { set: "!%^&*-+=|~/<>", value: CHARS.OPERATOR },
  { set: "[]{}()", value: CHARS.BRACKET },
  { set: "'\"", value: CHARS.QUOTE },
  { set: undefined, value: CHARS.UNKNOWN },
];

export const e_char_type = (c, _charsets = charsets) =>
  _charsets.find((charset) => !charset.set || charset.set.includes(c)).value;

const charsets2 = [
  {
    set: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ._",
    value: CHARS.LATIN,
  },
  {
    set: "123456890",
    value: CHARS.DIGIT,
  },
  { set: "!%^&*-+=|~/<>", value: CHARS.OPERATOR },
  { set: "[]{}()", value: CHARS.BRACKET },
  { set: "'\"", value: CHARS.QUOTE },
  { set: undefined, value: CHARS.UNKNOWN },
];

const tokensets = {
  [CHARS.DIGIT]: TOKENS.NUMBER,
  [CHARS.LATIN]: TOKENS.NAME,
  [CHARS.OPERATOR]: TOKENS.OPERATOR,
  [CHARS.BRACKET]: TOKENS.BRACKET,
  [CHARS.QUOTE]: TOKENS.STRING,
  [CHARS.UNKNOWN]: TOKENS.UNKNOWN,
};

export const e_token_type = (t) => tokensets[e_char_type(t[0], charsets2)];
