import { expect } from "chai";
import { funcs } from "../EExpr.js";
import { ESource, OPERANDS } from "../ESource.js";
import { e_parse_set_contents, parsers } from "../e_parser.js";

describe("e_parser", () => {
  it("parsers[OPERANDS.(BOOL|NULL|UNDEFINED|INF|NUMBER|STRING)]", () => {
    expect(parsers[OPERANDS.BOOL](new ESource("", "true"))).to.be.true;
    expect(parsers[OPERANDS.BOOL](new ESource("", "false"))).to.be.false;
    expect(parsers[OPERANDS.NULL](new ESource("", "null"))).to.be.null;
    expect(parsers[OPERANDS.UNDEFINED](new ESource("", "undefined"))).to.be
      .undefined;
    expect(parsers[OPERANDS.INF](new ESource("", "Infinity"))).to.equal(
      Infinity
    );
    expect(parsers[OPERANDS.NUMBER](new ESource("", "234"))).to.equal(234);
    expect(parsers[OPERANDS.NUMBER](new ESource("", ".14"))).to.equal(0.14);
    expect(parsers[OPERANDS.NUMBER](new ESource("", "3.14"))).to.equal(3.14);
    expect(parsers[OPERANDS.NUMBER](new ESource("", "0x123"))).to.equal(0x123);
    expect(parsers[OPERANDS.STRING](new ESource("", "'hi'"))).to.equal("hi");
  });

  it("parsers[OPERANDS.REF]", () => {
    const src = new ESource("", "description");
    expect(parsers[OPERANDS.REF](src)).to.deep.equal({ name: "description" });
  });

  it("parsers[OPERANDS.INVOKE]", () => {
    let src = new ESource("", "add()");
    expect(parsers[OPERANDS.INVOKE](src)).to.deep.equal({
      name: "add",
      operands: [],
    });
    src = new ESource("", "add(})");
    expect(() => parsers[OPERANDS.INVOKE](src)).to.throw(") is expected");
    src = new ESource("", "add(a2, 3, 2)");
    expect(parsers[OPERANDS.INVOKE](src)).to.deep.equal({
      name: "add",
      operands: [{ name: "a2" }, 3, 2],
    });
  });

  it("parsers[OPERANDS.INDEXING]", () => {
    const src = new ESource("", "aa[a2, 3, 2]");
    expect(parsers[OPERANDS.INDEXING](src)).to.deep.equal({
      name: "aa",
      operands: [{ name: "a2" }, 3, 2],
    });
  });

  it("e_parse_set_contents", () => {
    let src = new ESource("", "aa += 5 * 3\nbc -= 2\n'ÔÒ'");
    expect(e_parse_set_contents(src)).to.deep.equal({
      operands: [
        {
          postfix: [{ name: "aa" }, 5, 3, funcs["*"].f, funcs["+="].f],
        },
        {
          postfix: [{ name: "bc" }, 2, funcs["-="].f],
        },
      ],
    });
    src = new ESource("", "a instanceof ESet\n5 in [1, 3, 5]");
    expect(e_parse_set_contents(src)).to.deep.equal({
      operands: [
        {
          postfix: [{ name: "a" }, { name: "ESet" }, funcs["instanceof"].f],
        },
        {
          postfix: [5, [1, 3, 5], funcs["in"].f],
        },
      ],
    });
    src = new ESource("", "a = 3 +");
    expect(() => e_parse_set_contents(src)).to.throw("operand is expected");
    src = new ESource("", "= 3 +");
    expect(() => e_parse_set_contents(src)).to.throw("operand is expected");
    src = new ESource("", " 3 +");
    expect(() => e_parse_set_contents(src)).to.throw("operand is expected");
    src = new ESource("", "[ )");
    expect(() => e_parse_set_contents(src)).to.not.throw;
    src = new ESource("", "a[1, 2, 3]");
    expect(e_parse_set_contents(src)).to.deep.equal({
      operands: [],
    });
    src = new ESource("", "()");
    expect(e_parse_set_contents(src)).to.deep.equal({
      operands: [],
    });
    src = new ESource("", "(1)");
    expect(e_parse_set_contents(src)).to.deep.equal({
      operands: [],
    });
    src = new ESource("", "(1 + 2)");
    expect(e_parse_set_contents(src)).to.deep.equal({
      operands: [{ postfix: [1, 2, funcs["+"].f] }],
    });
    src = new ESource("", "(1) add(1, 2)");
    expect(e_parse_set_contents(src)).to.deep.equal({
      operands: [{ name: "add", operands: [1, 2] }],
    });
    src = new ESource(
      "",
      `hello world a = 5 false null undefined Infinity 123 'hello world'
      a[3] {a = 2, b = 2, c = 3} (1 + 2) [1, 2, 3, 4] (1) add(1, 2)`
    );
    expect(e_parse_set_contents(src)).to.deep.equal({
      operands: [
        { postfix: [{ name: "a" }, 5, funcs["="].f] },
        { postfix: [1, 2, funcs["+"].f] },
        { name: "add", operands: [1, 2] },
      ],
    });
    src = new ESource("", "a = null");
    expect(e_parse_set_contents(src)).to.deep.equal({
      operands: [{ postfix: [{ name: "a" }, null, funcs["="].f] }],
    });
    src = new ESource("", "a = undefined");
    expect(e_parse_set_contents(src)).to.deep.equal({
      operands: [{ postfix: [{ name: "a" }, undefined, funcs["="].f] }],
    });
    src = new ESource("", "result = 1 * 2 + 3 * 5 - 2 / 2");
    expect(e_parse_set_contents(src)).to.deep.equal({
      operands: [
        {
          postfix: [
            ...[{ name: "result" }, 1, 2, funcs["*"].f, 3, 5, funcs["*"].f],
            ...[funcs["+"].f, 2, 2, funcs["/"].f, funcs["-"].f, funcs["="].f],
          ],
        },
      ],
    });
    src = new ESource("", "(1 + 2) * 4");
    expect(e_parse_set_contents(src)).to.deep.equal({
      operands: [
        {
          postfix: [1, 2, funcs["+"].f, 4, funcs["*"].f],
        },
      ],
    });
  });

  it("parsers[OPERANDS.SET]", () => {
    let src = new ESource("", "{aa += 5 * 3}");
    expect(parsers[OPERANDS.SET](src)).to.deep.equal({
      operands: [
        {
          postfix: [{ name: "aa" }, 5, 3, funcs["*"].f, funcs["+="].f],
        },
      ],
    });
    src = new ESource("", "{\naa += 5 * 3\nbc -= 2\n'ÔÒ'\n}");
    expect(parsers[OPERANDS.SET](src)).to.deep.equal({
      operands: [
        {
          postfix: [{ name: "aa" }, 5, 3, funcs["*"].f, funcs["+="].f],
        },
        {
          postfix: [{ name: "bc" }, 2, funcs["-="].f],
        },
      ],
    });
  });

  it("parsers[OPERANDS.ARRAY]", () => {
    const src = new ESource("", "[a2, 3, 2]");
    expect(parsers[OPERANDS.ARRAY](src)).to.deep.equal([{ name: "a2" }, 3, 2]);
  });

  it("parsers[OPERANDS.SUB]", () => {
    let src = new ESource("", "(aa += 5)");
    expect(parsers[OPERANDS.SUB](src)).to.deep.equal({
      postfix: [{ name: "aa" }, 5, funcs["+="].f],
    });
    src = new ESource("", "(aa)");
    expect(parsers[OPERANDS.SUB](src)).to.deep.equal({ name: "aa" });
  });
});
