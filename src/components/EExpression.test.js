import { expect } from "chai";
import { describe, it } from "mocha";
import { EExpression } from "./EExpression.js";
import { operators } from "./operators.js";

describe("EExpression", () => {
  const create = (operands, operators) => new EExpression(operands, operators);
  it("invalid operator", () => {
    expect(() => create([1, 2], ["+-+"])).to.throw("Unknown operator +-+");
  });
  it("auto minify expression", () => {
    expect(create([1, create([2, 3], ["*"])], ["+"])).to.deep.equal({
      postfix: [1, 2, 3, operators["*"].f, operators["+"].f],
    });
  });
  it("operators priority", () => {
    expect(create([1, 2, 3, 4], ["+", "*", "+"])).to.deep.equal({
      postfix: [
        1,
        2,
        3,
        operators["*"].f,
        operators["+"].f,
        4,
        operators["+"].f,
      ],
    });
  });
});
