import { expect } from "chai";
import {
  e_parse_array,
  e_parse_expression,
  e_parse_indexing,
  e_parse_invoke,
  e_parse_set,
  e_parse_set_contents,
  e_parse_sub,
} from "../e_parser.js";
import { ESource } from "../ESource.js";

describe("e_parser", () => {
  it("e_parse_invoke", () => {
    const source = new ESource("main.e", "  add  ( a2   3 2  )");
    expect(e_parse_invoke(source)).to.deep.equal({
      name: "add",
      expressions: [
        { operands: [{ name: "a2" }], operators: [] },
        { operands: [{ value: "3" }], operators: [] },
        { operands: [{ value: "2" }], operators: [] },
      ],
    });
  });

  it("e_parse_indexing", () => {
    const source = new ESource("main.e", "  a [ a2   3 2  ]");
    expect(e_parse_indexing(source)).to.deep.equal({
      name: "a",
      expressions: [
        { operands: [{ name: "a2" }], operators: [] },
        { operands: [{ value: "3" }], operators: [] },
        { operands: [{ value: "2" }], operators: [] },
      ],
    });
  });

  it("e_parse_array", () => {
    const source = new ESource("main.e", "[ a2   3 2  ] ");
    expect(e_parse_array(source)).to.deep.equal({
      expressions: [
        { operands: [{ name: "a2" }], operators: [] },
        { operands: [{ value: "3" }], operators: [] },
        { operands: [{ value: "2" }], operators: [] },
      ],
    });
  });

  it("e_parse_expression", () => {
    const source = new ESource("main.e", "  aa +=  5 ");
    expect(e_parse_expression(source)).to.deep.equal({
      operands: [{ name: "aa" }, { value: "5" }],
      operators: ["+="],
    });
  });

  it("e_parse_sub", () => {
    const source = new ESource("main.e", " (  aa +=  5 ) ");
    expect(e_parse_sub(source)).to.deep.equal({
      operands: [{ name: "aa" }, { value: "5" }],
      operators: ["+="],
    });
  });

  it("e_parse_set_contents", () => {
    const source = new ESource("main.e", "   aa +=  5 bc -= 2 ");
    expect(e_parse_set_contents(source)).to.deep.equal({
      expressions: [
        {
          operands: [{ name: "aa" }, { value: "5" }],
          operators: ["+="],
        },
        {
          operands: [{ name: "bc" }, { value: "2" }],
          operators: ["-="],
        },
      ],
    });
  });

  it("e_parse_set", () => {
    const source = new ESource("main.e", " {  aa +=  5 * 3 bc -= 2 'ÔÒ' } ");
    expect(e_parse_set(source)).to.deep.equal({
      expressions: [
        {
          operands: [{ name: "aa" }, { value: "5" }, { value: "3" }],
          operators: ["+=", "*"],
        },
        {
          operands: [{ name: "bc" }, { value: "2" }],
          operators: ["-="],
        },
        {
          operands: [{ value: "'ÔÒ'" }],
          operators: [],
        },
      ],
    });
  });
});
