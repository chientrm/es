import { CHARS, e_char_type, e_token_type, TOKENS } from "./e_char.js";

export const OPERANDS = {
  BOOL: 0,
  NULL: 1,
  UNDEFINED: 2,
  INF: 3,
  NUMBER: 4,
  STRING: 5,
  REF: 6,
  INVOKE: 7,
  INDEXING: 8,
  SET: 9,
  ARRAY: 10,
  SUB: 11,
};

export class ESource {
  constructor(filename, text) {
    this.filename = filename;
    this.text = text;
    this.offset = 0;
  }
  lineNo(offset) {
    let result = 1;
    while (offset > 0) {
      result += this.charIs(offset, "\n");
      offset -= 1;
    }
    return result;
  }
  expected(what) {
    throw new SyntaxError(
      `${this.filename}:${this.lineNo(this.offset)}\nError: ${what} is expected`
    );
  }
  valid = (offset) => offset >= 0 && offset < this.text.length;
  skip(offset, cond) {
    while (this.valid(offset) && cond(offset)) offset += 1;
    return offset;
  }
  skipSpace = (offset) =>
    this.skip(offset, (_offset) => this.charTypeIs(_offset, CHARS.SPACE));
  hasToken = (offset) => this.valid(this.skipSpace(offset));
  getToken = (offset, pop = false) => {
    let result = null;
    offset = this.skipSpace(offset);
    if (this.valid(offset)) {
      if (this.charTypeIs(offset, CHARS.QUOTE)) {
        const quote = this.text[offset];
        const end = this.skip(
          offset + 1,
          (_offset) => !this.charIs(_offset, quote)
        );
        if (this.valid(end) && this.charIs(end, quote)) {
          result = this.text.substring(offset, end + 1);
          if (pop) this.offset = end + 1;
        } else this.expected(`end of string (${quote})`);
      } else {
        const end = this.skip(
          offset + 1,
          (_offset) =>
            !this.charTypeIs(_offset, CHARS.BRACKET) &&
            this.charTypeSame(offset, _offset)
        );
        if (this.valid(end - 1)) {
          result = this.text.substring(offset, end);
          if (pop) this.offset = end;
        }
      }
    }
    return result;
  };
  hasNextToken = () => this.hasToken(this.offset);
  getNextToken = () => this.getToken(this.offset);
  tokenIs = (offset, value) => this.getToken(offset) === value;
  nextTokenIs = (value) => this.tokenIs(this.offset, value);
  nextTokenTypeIs = (type) => e_token_type(this.getNextToken()) === type;
  popNextToken = () => this.getToken(this.offset, true);
  charIs = (offset, value) => this.text[offset] === value;
  charTypeIs = (offset, type) => e_char_type(this.text[offset]) === type;
  charTypeSame = (a, b) =>
    e_char_type(this.text[a]) === e_char_type(this.text[b]);
  nextOperandType() {
    const token = this.getNextToken();
    if (token === "true" || token === "false") return OPERANDS.BOOL;
    if (token === "null") return OPERANDS.NULL;
    if (token === "undefined") return OPERANDS.UNDEFINED;
    if (token === "Infinity") return OPERANDS.INF;
    if (e_token_type(token) === TOKENS.NUMBER) return OPERANDS.NUMBER;
    if (e_token_type(token) === TOKENS.STRING) return OPERANDS.STRING;
    if (e_token_type(token) === TOKENS.NAME) {
      const offset = this.skipSpace(this.offset) + token.length;
      const token2 = this.getToken(offset);
      if (token2) {
        if (token2 === "(") return OPERANDS.INVOKE;
        if (token2 === "[") return OPERANDS.INDEXING;
      }
    }
    if (token === "{") return OPERANDS.SET;
    if (token === "[") return OPERANDS.ARRAY;
    if (token === "(") return OPERANDS.SUB;
    return OPERANDS.REF;
  }
  matchToken(token) {
    this.nextTokenIs(token) || this.expected(token);
    this.popNextToken();
  }
}
