import { expect } from "chai";
import { describe, it } from "mocha";
import { EObject } from "./EObject.js";

describe("EObject", () => {
  it("empty object", () => {
    expect(new EObject(undefined)).to.deep.equal({});
  });
  it("non-empty object", () => {
    const object = { name: "alice", age: 12 };
    expect(new EObject(object)).to.deep.equal(object);
  });
  it("object run", () => {
    expect(() => new EObject().run()).to.throw(
      "EObject.run is not implemented"
    );
  });
});
