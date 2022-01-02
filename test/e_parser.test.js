import { expect } from "chai";
import { describe, it } from "mocha";
import {
  OPERANDS,
  Source,
  parsers,
  parseTupleContent,
} from "../src/lexical/index.js";
import { operators as funcs } from "../src/core/index.js";

describe("e_parser", () => {
  it("parsers[OPERANDS.(BOOL|NULL|UNDEFINED|INF|NUMBER|STRING)]", () => {
    expect(parsers[OPERANDS.BOOL](new Source("", "true"))).to.be.true;
    expect(parsers[OPERANDS.BOOL](new Source("", "false"))).to.be.false;
    expect(parsers[OPERANDS.NULL](new Source("", "null"))).to.be.null;
    expect(parsers[OPERANDS.UNDEFINED](new Source("", "undefined"))).to.be
      .undefined;
    expect(parsers[OPERANDS.INF](new Source("", "Infinity"))).to.equal(
      Infinity
    );
    expect(parsers[OPERANDS.NUMBER](new Source("", "234"))).to.equal(234);
    expect(parsers[OPERANDS.NUMBER](new Source("", "3.14"))).to.equal(3);
    expect(parsers[OPERANDS.NUMBER](new Source("", "0x123"))).to.equal(0x123);
    expect(parsers[OPERANDS.STRING](new Source("", "'hi'"))).to.equal("hi");
  });

  it("parsers[OPERANDS.REF]", () => {
    const src = new Source("", "a");
    expect(parsers[OPERANDS.REF](src)).to.deep.equal({ name: "a" });
  });

  it("parsers[OPERANDS.INVOKE]", () => {
    let src = new Source("", "add()");
    expect(parsers[OPERANDS.INVOKE](src)).to.deep.equal({
      name: "add",
      operands: [],
    });
    src = new Source("", "add(})");
    expect(() => parsers[OPERANDS.INVOKE](src)).to.throw(") is expected");
    src = new Source("", "add(a2, 3, 2)");
    expect(parsers[OPERANDS.INVOKE](src)).to.deep.equal({
      name: "add",
      operands: [{ name: "a2" }, 3, 2],
    });
  });

  it("parsers[OPERANDS.INDEXING]", () => {
    const parse = (text) => parsers[OPERANDS.INDEXING](new Source("", text));

    expect(parse("a[]")).to.deep.equal({
      name: "a",
      operands: [],
    });
    expect(parse("a[a2, 2]")).to.deep.equal({
      name: "a",
      operands: [{ name: "a2" }, 2],
    });
  });

  it("e_parse_tuple_contents", () => {
    const parse = (text) => parseTupleContent(new Source("", text));

    expect(() => parse(".14")).to.throw("operand is expected");
    expect(() => parse("a = 3 +")).to.throw("operand is expected");
    expect(() => parse("= 3 +")).to.throw("operand is expected");
    expect(parse("()")).to.be.undefined;
    expect(() => parse("(]")).to.throw(") is expected");
    expect(parse("(1)")).to.be.undefined;
    expect(parse("a[1, 2, 3]")).to.be.undefined;
    expect(parse("(1 + 2)")).to.be.undefined;
    expect(parse("add(1, 2)")).to.deep.equal({
      operands: [
        {
          name: "add",
          operands: [1, 2],
        },
      ],
    });
    expect(parse("Infinity = null * undefined")).to.deep.equal({
      operands: [
        {
          postfix: [Infinity, null, undefined, funcs["*"].f, funcs["="].f],
        },
      ],
    });
    expect(parse("0.14")).to.deep.equal({
      operands: [{ postfix: [0, 14, funcs["."].f] }],
    });
    expect(parse("a = 1 * 2 + 3 * 5 - 2 / 2")).to.deep.equal({
      operands: [
        {
          postfix: [
            ...[{ name: "a" }, 1, 2, funcs["*"].f, 3, 5, funcs["*"].f],
            ...[funcs["+"].f, 2, 2, funcs["/"].f, funcs["-"].f, funcs["="].f],
          ],
        },
      ],
    });
    expect(parse("(1 + 2) * 4")).to.deep.equal({
      operands: [
        {
          postfix: [
            { operands: [{ postfix: [1, 2, funcs["+"].f] }] },
            4,
            funcs["*"].f,
          ],
        },
      ],
    });
    expect(
      parse(`hello world a = 5 false null undefined Infinity 123 'hello world'
    a[3] {a = 2, b = 2, c = 3} (1 + 2) [1, 2, 3, 4] (1) add(1, 2)`)
    ).to.deep.equal({
      operands: [
        { postfix: [{ name: "a" }, 5, funcs["="].f] },
        { name: "add", operands: [1, 2] },
      ],
    });
    expect(parse("inc = a => (a + 1)")).to.deep.equal({
      operands: [
        {
          postfix: [
            { name: "inc" },
            { name: "a" },
            { operands: [{ postfix: [{ name: "a" }, 1, funcs["+"].f] }] },
            funcs["=>"].f,
            funcs["="].f,
          ],
        },
      ],
    });
  });

  it("parsers[OPERANDS.TUPLE]", () => {
    const parse = (text) => parsers[OPERANDS.TUPLE](new Source("", text));

    expect(() => parse("(]")).to.throw(") is expected");
    expect(parse("()")).to.be.undefined;
    expect(parse("(a)")).to.be.undefined;
    expect(parse("(a = 1)")).to.deep.equal({
      operands: [
        {
          postfix: [{ name: "a" }, 1, funcs["="].f],
        },
      ],
    });
    expect(parse("(a = 1 a + b)")).to.deep.equal({
      operands: [
        { postfix: [{ name: "a" }, 1, funcs["="].f] },
        { postfix: [{ name: "a" }, { name: "b" }, funcs["+"].f] },
      ],
    });
  });

  it("parsers[OPERANDS.SET]", () => {
    const parse = (text) => parsers[OPERANDS.SET](new Source("", text));

    expect(() => parse("{")).to.throw("} is expected");
    expect(parse("{}")).to.deep.equal({
      operands: [],
    });
    expect(parse("{a = 5 * 3}")).to.deep.equal({
      operands: [
        {
          postfix: [{ name: "a" }, 5, 3, funcs["*"].f, funcs["="].f],
        },
      ],
    });
    expect(parse("{a = 5 * 3, b = 2, ''}")).to.deep.equal({
      operands: [
        {
          postfix: [{ name: "a" }, 5, 3, funcs["*"].f, funcs["="].f],
        },
        {
          postfix: [{ name: "b" }, 2, funcs["="].f],
        },
      ],
    });
  });

  it("parsers[OPERANDS.ARRAY]", () => {
    const parse = (text) => parsers[OPERANDS.ARRAY](new Source("", text));

    expect(() => parse("[)")).to.throw("] is expected");
    expect(parse("[]")).to.deep.equal({ operands: [] });
    expect(parse("[a2, 3, 2]")).to.deep.equal({
      operands: [{ name: "a2" }, 3, 2],
    });
  });
});
