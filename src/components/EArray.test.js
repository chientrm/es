import { expect } from "chai";
import { describe, it } from "mocha";
import { EArray } from "./EArray.js";
import { EReference } from "./EReference.js";
import { EExpression } from "./EExpression.js";

describe("EArray", () => {
  const run = (contexts, operands) => new EArray(operands).run(contexts);
  it("empty array", () => {
    expect(run([{}], [])).to.deep.equal([]);
  });
  it("non-empty array", () => {
    expect(run([{ name: "alice" }], [new EReference("name")])).to.deep.equal([
      "alice",
    ]);
  });
  it("name list", () => {
    expect(
      run(
        [{ a: { b: 1 } }],
        [new EExpression([new EReference("a"), new EReference("b")], ["."])]
      )
    ).to.deep.equal([1]);
  });
});
