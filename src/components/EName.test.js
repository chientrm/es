import { expect } from "chai";
import { describe, it } from "mocha";
import { EName } from "./EName.js";

describe("EName", () => {
  it("assign", () => {
    expect(() => new EName().assign()).to.throw(
      "EName.assign is not implemented"
    );
  });
});
