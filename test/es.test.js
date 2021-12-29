import { expect } from "chai";
import { e_eval } from "../src/es.js";

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
    expect(e_eval([{}], "", "f = _ => (a = 1) false && f() r = a")).to.be
      .undefined;
    expect(
      e_eval([{}], "", "a = 0 f = _ => (a = 1) true && f() r = a")
    ).to.equal(1);
    expect(e_eval([{}], "", "f = _ => (a = 1) true || f() r = a")).to.be
      .undefined;
    expect(
      e_eval([{}], "", "a = 0 f = _ => (a = 1) false || f() r = a")
    ).to.equal(1);
    expect(e_eval([{}], "", "f = _ => {name = 'bob'} r = f()")).to.deep.equal({
      name: "bob",
    });
    expect(e_eval([{}], "", "o = {} o.name = 'alice'")).to.equal("alice");
    expect(e_eval([{}], "", "f = _ => {name = 'bob'} r = f().name")).to.equal(
      "bob"
    );
    expect(
      e_eval([{}], "", "a = [{name = 'bob'}, {gender = 'male'}] r = a[0].name")
    ).to.equal("bob");
  });
});
