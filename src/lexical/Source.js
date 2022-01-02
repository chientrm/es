import { CHARS, getCharType, getTokenType, TOKENS } from "./char.js";
import { syntaxExpected } from "../core/index.js";

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
  TUPLE: 11,
};

export class Source {
  constructor(filename, text) {
    this.filename = filename;
    this.text = text;
    this.offset = 0;
  }
  lineNo(offset = this.offset) {
    let result = 1;
    while (offset > 0) (result += this.charIs(offset, "\n")), (offset -= 1);
    return result;
  }
  expected = (what) => syntaxExpected(this.filename, this.lineNo(), what);
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
        const end = this.skip(offset + 1, (at) => !this.charIs(at, quote));
        if (this.valid(end) && this.charIs(end, quote)) {
          result = this.text.substring(offset, end + 1);
          pop && (this.offset = end + 1);
        } else this.expected(`end of string (${quote})`);
      } else {
        const end = this.skip(
          offset + 1,
          (at) =>
            !this.charTypeIs(at, CHARS.BRACKET) && this.charTypeSame(offset, at)
        );
        if (this.valid(end - 1)) {
          result = this.text.substring(offset, end);
          pop && (this.offset = end);
        }
      }
    }
    return result;
  };
  hasNextToken = () => this.hasToken(this.offset);
  getNextToken = () => this.getToken(this.offset);
  tokenIs = (offset, value) => this.getToken(offset) === value;
  nextTokenIs = (value) => this.tokenIs(this.offset, value);
  nextTokenTypeIs = (type) => getTokenType(this.getNextToken()) === type;
  popNextToken = () => this.getToken(this.offset, true);
  charIs = (offset, value) => this.text[offset] === value;
  charTypeIs = (offset, type) => getCharType(this.text[offset]) === type;
  charTypeSame = (a, b) =>
    getCharType(this.text[a]) === getCharType(this.text[b]);
  nextOperandType() {
    const token = this.getNextToken();
    if (token === "true" || token === "false") return OPERANDS.BOOL;
    if (token === "null") return OPERANDS.NULL;
    if (token === "undefined") return OPERANDS.UNDEFINED;
    if (token === "Infinity") return OPERANDS.INF;
    if (getTokenType(token) === TOKENS.NUMBER) return OPERANDS.NUMBER;
    if (getTokenType(token) === TOKENS.STRING) return OPERANDS.STRING;
    if (getTokenType(token) === TOKENS.NAME) {
      const offset = this.skipSpace(this.offset) + token.length;
      const token2 = this.getToken(offset);
      if (token2) {
        if (token2 === "(") return OPERANDS.INVOKE;
        if (token2 === "[") return OPERANDS.INDEXING;
      }
    }
    if (token === "{") return OPERANDS.SET;
    if (token === "[") return OPERANDS.ARRAY;
    if (token === "(") return OPERANDS.TUPLE;
    return OPERANDS.REF;
  }
  matchToken(token) {
    this.nextTokenIs(token) || this.expected(token);
    this.popNextToken();
  }
}
