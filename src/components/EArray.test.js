import { expect } from "chai";
import { describe, it } from "mocha";
import { EArray } from "./EArray.js";
import { EReference } from "./EReference.js";

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
});
