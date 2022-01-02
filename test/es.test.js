import { expect } from "chai";
import { describe, it } from "mocha";
import { eEval } from "../src/escript.js";

describe("es", () => {
  it("e_eval", () => {
    expect(eEval([], "", "")).to.be.undefined;
    expect(eEval([], "", "a")).to.be.undefined;
    expect(eEval([{}], "", "result = 1 * 2 + 3 * 5 - 2 / 2")).to.equal(16);
    expect(eEval([{}], "", "result = (1 + 2) * 4")).to.equal(12);
    expect(eEval([{}], "", "inc = a => (a + 1) inc(1)")).to.equal(2);
    expect(eEval([{}], "", "sum = [a b] => (a + b) sum(1, 2.14)")).to.equal(
      3.14
    );
    expect(
      eEval([{}], "", "sum = [a b] => (a + b) o = {v = 1} sum(o.v, 2.14)")
    ).to.equal(3.14);
    expect(eEval([{}], "", "f = _ => (a = 1) false && f() r = a")).to.be
      .undefined;
    expect(
      eEval([{}], "", "a = 0 f = _ => (a = 1) true && f() r = a")
    ).to.equal(1);
    expect(eEval([{}], "", "f = _ => (a = 1) true || f() r = a")).to.be
      .undefined;
    expect(
      eEval([{}], "", "a = 0 f = _ => (a = 1) false || f() r = a")
    ).to.equal(1);
    expect(eEval([{}], "", "f = _ => {name = 'bob'} r = f()")).to.deep.equal({
      name: "bob",
    });
    expect(eEval([{}], "", "o = {} o.name = 'alice'")).to.equal("alice");
    expect(eEval([{}], "", "f = _ => {name = 'bob'} r = f().name")).to.equal(
      "bob"
    );
    expect(
      eEval([{}], "", "a = [{name = 'bob'}, {gender = 'male'}] r = a[0].name")
    ).to.equal("bob");
  });
  it("concat object", () => {
    expect(eEval([{}], "", "{} + 1")).to.equal("[object Object]1");
    expect(eEval([{}], "", "1 + {}")).to.equal("1[object Object]");
    expect(eEval([{}], "", "{name = 'bob'} + {age = 12}")).to.deep.equal({
      name: "bob",
      age: 12,
    });
  });
  it("function", () => {
    expect(eEval([{}], "", "f = _ => 1 r = f()")).to.equal(1);
    // expect(
    //   eEval([{}], "", "a = 0 b = _ => (a = 1) f = _ => b() r = a")
    // ).to.equal(1);
    expect(eEval([{}], "", "a = 0 f = _ => (a = 1) f() r = a")).to.deep.equal(
      1
    );
  });
});
