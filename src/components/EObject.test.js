import { expect } from "chai";
import { describe, it } from "mocha";
import { EObject } from "./EObject.js";

describe("EObject", () => {
  it("empty object", () => {
    expect(() => new EObject().run([])).to.throw("Not implemented");
  });
  it("non-empty object", () => {
    const object = { name: "alice", age: 12 };
    expect(new EObject(object)).to.deep.equal(object);
  });
});
