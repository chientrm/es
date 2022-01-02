import { expect } from "chai";
import { describe, it } from "mocha";
import { EArray } from "./EArray.js";

describe("EArray", () => {
  it("empty array", () => {
    expect(new EArray([]).run([{}])).to.deep.equal([]);
  });
  it("non-empty array", () => {
    expect(
      new EArray([new ERef("name")]).run([{ name: "alice" }])
    ).to.deep.equal(["alice"]);
  });
});
