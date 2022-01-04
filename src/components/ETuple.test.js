import { expect } from "chai";
import { describe, it } from "mocha";
import { EExpression } from "./EExpression.js";
import { EInvoke } from "./EInvoke.js";
import { EReference } from "./EReference.js";
import { ETuple } from "./ETuple.js";

describe("ETuple", () => {
  const run = (contexts, operands) => new ETuple(operands).run(contexts);

  it("empty", () => {
    expect(run([{}], [])).to.be.undefined;
  });
  it("single expression", () => {
    expect(
      run([{}], [new EExpression([new EReference("r"), 1], ["="])])
    ).to.equal(1);
  });
  it("multi expression", () => {
    expect(
      run(
        [{}],
        [
          new EExpression([new EReference("r"), 1], ["="]),
          new EExpression([new EReference("r"), 2], ["+"]),
        ]
      )
    ).to.equal(3);
  });
  it("name list", () => {
    expect(
      run(
        [{ o: { f: () => 1 } }],
        [new EExpression([new EReference("o"), new EInvoke("f", [])], ["."])]
      )
    ).to.equal(1);
  });
});
