import { expect } from "chai";
import { describe, it } from "mocha";
import { EExpression } from "./EExpression.js";
import { EReference } from "./EReference.js";
import { EInvoke } from "./EInvoke.js";
import { ESet } from "./ESet.js";

describe("ESet", () => {
  const run = (contexts, operands) => new ESet(operands).run(contexts);

  it("empty", () => {
    expect(run([{}], [])).to.deep.equal({});
  });
  it("single expression", () => {
    expect(
      run([{}], [new EExpression([new EReference("r"), 1], ["="])])
    ).to.deep.equal({ r: 1 });
  });
  it("multi expression", () => {
    expect(
      run(
        [{}],
        [
          new EExpression([new EReference("a"), 1], ["="]),
          new EExpression(
            [new EReference("b"), new EReference("a"), 2],
            ["=", "+"]
          ),
        ]
      )
    ).to.deep.equal({ a: 1, b: 3 });
  });
  it("name list", () => {
    expect(
      run(
        [{ o: { f: () => 1 } }],
        [
          new EExpression(
            [new EReference("r"), new EReference("o"), new EInvoke("f", [])],
            ["=", "."]
          ),
        ]
      )
    ).to.deep.equal({ r: 1 });
  });
});
