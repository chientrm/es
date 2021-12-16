import { expect } from "chai";
import { ESource, OPERANDS } from "../ESource.js";
import { e_parse_set_contents, parsers } from "../e_parser.js";

describe("e_parser", () => {
  it("parsers[OPERANDS.(BOOL|NULL|UNDEFINED|NUMBER|STRING)]", () => {
    expect(parsers[OPERANDS.BOOL](new ESource("", "true"))).to.be.true;
    expect(parsers[OPERANDS.BOOL](new ESource("", "false"))).to.be.false;
    expect(parsers[OPERANDS.NULL](new ESource("", "null"))).to.be.null;
    expect(parsers[OPERANDS.UNDEFINED](new ESource("", "undefined"))).to.be
      .undefined;
    expect(parsers[OPERANDS.NUMBER](new ESource("", "234"))).to.equal(234);
    expect(parsers[OPERANDS.NUMBER](new ESource("", ".14"))).to.equal(0.14);
    expect(parsers[OPERANDS.NUMBER](new ESource("", "3.14"))).to.equal(3.14);
    expect(parsers[OPERANDS.NUMBER](new ESource("", "0x123"))).to.equal(0x123);
    expect(parsers[OPERANDS.STRING](new ESource("", "'hi'"))).to.equal("hi");
  });

  it("parsers[OPERANDS.REF]", () => {
    const src = new ESource("", "sum");
    expect(parsers[OPERANDS.REF](src).run([{ sum: 5 }])).to.equal(5);
    expect(parsers[OPERANDS.REF](src).run([])).to.be.undefined;
  });

  it("parsers[OPERANDS.INVOKE]", () => {
    const src = new ESource("", "add(a2, 3, 2)");
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

  it("parsers[OPERANDS.ARRAY]", () => {
    const src = new ESource("", "[a2, 3, 2]");
    expect(parsers[OPERANDS.ARRAY](src)).to.deep.equal([{ name: "a2" }, 3, 2]);
  });

  it("parsers[OPERANDS.SUB]", () => {
    let src = new ESource("", "(aa += 5)");
    expect(parsers[OPERANDS.SUB](src)).to.deep.equal({
      operands: [{ name: "aa" }, 5],
      operators: ["+="],
    });
    src = new ESource("", "(aa)");
    expect(parsers[OPERANDS.SUB](src)).to.deep.equal({ name: "aa" });
  });

  it("parsers[OPERANDS.SET]", () => {
    const src = new ESource("", "{\naa += 5 * 3\nbc -= 2\n'ÔÒ'\n}");
    expect(parsers[OPERANDS.SET](src)).to.deep.equal({
      operands: [
        {
          operands: [{ name: "aa" }, 5, 3],
          operators: ["+=", "*"],
        },
        {
          operands: [{ name: "bc" }, 2],
          operators: ["-="],
        },
        "ÔÒ",
      ],
    });
  });

  it("e_parse_set_contents", () => {
    let src = new ESource("", "aa += 5 * 3\nbc -= 2\n'ÔÒ'");
    expect(e_parse_set_contents(src)).to.deep.equal({
      operands: [
        {
          operands: [{ name: "aa" }, 5, 3],
          operators: ["+=", "*"],
        },
        {
          operands: [{ name: "bc" }, 2],
          operators: ["-="],
        },
        "ÔÒ",
      ],
    });
    src = new ESource("", "a = 3 +");
    expect(() => e_parse_set_contents(src)).to.throw("operand is expected");
    src = new ESource("", "= 3 +");
    expect(() => e_parse_set_contents(src)).to.throw("operand is expected");
    src = new ESource("", " 3 +");
    expect(() => e_parse_set_contents(src)).to.throw("expression is expected");
  });
});
