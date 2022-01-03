import { expect } from "chai";
import { describe, it } from "mocha";
import { CHARS, getCharType, getTokenType, TOKENS } from "./char.js";

describe("char", () => {
  it("getCharType", () => {
    expect(getCharType("\f")).to.equal(CHARS.SPACE);
    expect(getCharType("a")).to.equal(CHARS.NAME);
    expect(getCharType("0")).to.equal(CHARS.NAME);
    expect(getCharType("")).to.equal(CHARS.NAME);
    expect(getCharType("~")).to.equal(CHARS.OPERATOR);
    expect(getCharType("]")).to.equal(CHARS.BRACKET);
    expect(getCharType('"')).to.equal(CHARS.QUOTE);
  });
  it("getTokenType", () => {
    expect(getTokenType("010")).to.equal(TOKENS.NUMBER);
    expect(getTokenType("0x10")).to.equal(TOKENS.NUMBER);
    expect(getTokenType("abcd")).to.equal(TOKENS.NAME);
    expect(getTokenType("a123")).to.equal(TOKENS.NAME);
    expect(getTokenType("ÔÒ")).to.equal(TOKENS.NAME);
    expect(getTokenType("+=")).to.equal(TOKENS.OPERATOR);
    expect(getTokenType("instanceof")).to.equal(TOKENS.OPERATOR);
    expect(getTokenType("in")).to.equal(TOKENS.OPERATOR);
    expect(getTokenType('"')).to.equal(TOKENS.STRING);
  });
});
