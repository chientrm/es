import { expect } from "chai";
import { CHARS, e_char_type, e_token_type, TOKENS } from "../echar.js";

describe("echar", () => {
  it("e_char_type", () => {
    expect(e_char_type("\f")).to.equal(CHARS.SPACE);
    expect(e_char_type("a")).to.equal(CHARS.NAME);
    expect(e_char_type("0")).to.equal(CHARS.NAME);
    expect(e_char_type("~")).to.equal(CHARS.OPERATOR);
    expect(e_char_type("]")).to.equal(CHARS.BRACKET);
    expect(e_char_type('"')).to.equal(CHARS.QUOTE);
    expect(e_char_type("Ô")).to.equal(CHARS.UNKNOWN);
  });
  it("e_token_type", () => {
    expect(e_token_type("010")).to.equal(TOKENS.NUMBER);
    expect(e_token_type("abcd")).to.equal(TOKENS.NAME);
    expect(e_token_type("+=")).to.equal(TOKENS.OPERATOR);
    expect(e_token_type("{")).to.equal(TOKENS.BRACKET);
    expect(e_token_type('"')).to.equal(TOKENS.STRING);
    expect(e_token_type("ÔÒ")).to.equal(TOKENS.UNKNOWN);
  });
});
