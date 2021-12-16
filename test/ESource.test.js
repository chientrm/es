import { expect } from "chai";
import { CHARS } from "../e_char.js";
import { ESource, OPERANDS } from "../ESource.js";

describe("ESource", () => {
  it("lineNo", () => {
    const source = new ESource("main.e", "    a \n  =   3 ");
    expect(source.lineNo(0)).to.equal(1);
    expect(source.lineNo(7)).to.equal(2);
  });
  it("expected", () => {
    const source = new ESource();
    expect(() => source.expected("a")).to.throw("a is expected");
  });
  it("valid", () => {
    const text = "    abcd   =   3333 ";
    const source = new ESource("main.e", text);
    expect(source.valid(-1)).to.be.false;
    expect(source.valid(0)).to.be.true;
    expect(source.valid(text.length - 1)).to.be.true;
    expect(source.valid(text.length)).to.be.false;
  });

  it("skip", () => {
    const source = new ESource("main.e", "    a   =   3 ");
    expect(
      source.skip(0, (offset) => " a".includes(source.text[offset]))
    ).to.equal(8);
    expect(
      source.skip(0, (offset) => " a=".includes(source.text[offset]))
    ).to.equal(12);
  });

  it("skipSpace", () => {
    const source = new ESource("main.e", "    a   =   3 ");
    expect(source.skipSpace(0)).to.equal(4);
    expect(source.skipSpace(5)).to.equal(8);
    expect(source.skipSpace(9)).to.equal(12);
    expect(source.skipSpace(13)).to.equal(14);
  });

  it("hasToken", () => {
    const source = new ESource("main.e", "    a   =   3 ");
    expect(source.hasToken(0)).to.be.true;
    expect(source.hasToken(5)).to.be.true;
    expect(source.hasToken(9)).to.be.true;
    expect(source.hasToken(13)).to.be.false;
  });

  it("getToken, getNextToken, tokenIs, nextTokenIs", () => {
    const source = new ESource("main.e", "    abcd   =   3333 ");
    expect(source.getNextToken()).to.equal("abcd");
    expect(source.getToken(8)).to.equal("=");
    expect(source.getToken(12)).to.equal("3333");
    expect(source.getToken(19)).to.be.null;
  });

  it("getToken exceptions", () => {
    const source = new ESource("main.e", "  'aksds d ");
    expect(() => source.getNextToken()).to.throw(
      "end of string (') is expected"
    );
  });

  it("popNextToken", () => {
    const source = new ESource(
      "main.e",
      "    abcd   =   3333 ; ss = 'hello world' : add (2, 3) "
    );
    expect(source.popNextToken()).to.equal("abcd");
    expect(source.popNextToken()).to.equal("=");
    expect(source.popNextToken()).to.equal("3333");
    expect(source.popNextToken()).to.equal("ss");
    expect(source.popNextToken()).to.equal("=");
    expect(source.popNextToken()).to.equal("'hello world'");
    expect(source.popNextToken()).to.equal("add");
    expect(source.popNextToken()).to.equal("(");
    expect(source.popNextToken()).to.equal("2");
    expect(source.popNextToken()).to.equal("3");
    expect(source.popNextToken()).to.equal(")");
    expect(source.popNextToken()).to.be.null;
  });

  it("charIs, charTypeIs, charTypeSame", () => {
    const source = new ESource("main.e", "    abcd   =   3333 ");
    expect(source.charIs(4, "a")).to.be.true;
    expect(source.charTypeIs(11, CHARS.OPERATOR)).to.be.true;
    expect(source.charTypeSame(15, 16)).to.be.true;
    expect(source.charTypeSame(14, 15)).to.be.false;
  });

  it("nextOperandType", () => {
    [
      { source: " true ", exp: OPERANDS.BOOL },
      { source: " null ", exp: OPERANDS.NULL },
      { source: " undefined ", exp: OPERANDS.UNDEFINED },
      { source: " Infinity ", exp: OPERANDS.INF },
      { source: "  3333 ", exp: OPERANDS.NUMBER },
      { source: "  'ad8892' ", exp: OPERANDS.STRING },
      { source: " abcd = 3333 ", exp: OPERANDS.REF },
      { source: " add (a) ", exp: OPERANDS.INVOKE },
      { source: " arr [5, 1 + 2]", exp: OPERANDS.INDEXING },
      { source: "  ", exp: OPERANDS.UNKNOWN },
    ].forEach((t) =>
      expect(new ESource("main.e", t.source).nextOperandType()).to.equal(t.exp)
    );
  });
  it("matchToken", () => {
    const source = new ESource("main.e", "    abcd   =   3333 ");
    expect(() => source.matchToken("(")).to.throw("( is expected");
  });
});
