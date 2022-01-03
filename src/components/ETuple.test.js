import { expect } from "chai";
import { describe, it } from "mocha";
import { EExpression } from "./EExpression.js";
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
});
