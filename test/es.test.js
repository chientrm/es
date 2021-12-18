import { expect } from "chai";
import { e_eval } from "../es.js";

describe("es", () => {
  it("ESource", () => {
    expect(e_eval([], "", "result = 1 * 2 + 3 * 5 - 2 / 2")).to.deep.equal({
      result: 16,
    });
  });
});
