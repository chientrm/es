import { expect } from "chai";
import { e_eval } from "../es.js";

describe("es", () => {
  it("e_eval", () => {
    expect(e_eval([], "", "")).to.be.undefined;
    expect(e_eval([], "", "a")).to.be.undefined;
    expect(e_eval([{}], "", "result = 1 * 2 + 3 * 5 - 2 / 2")).to.equal(16);
    expect(e_eval([{}], "", "result = (1 + 2) * 4")).to.equal(12);
    expect(e_eval([{}], "", "inc = a => (a + 1) inc(1)")).to.equal(2);
    expect(e_eval([{}], "", "sum = [a b] => (a + b) sum(1, 2.14)")).to.equal(
      3.14
    );
  });
});
