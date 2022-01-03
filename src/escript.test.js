import { expect } from "chai";
import { describe, it } from "mocha";
import { eEval } from "../src/escript.js";

describe("escript", () => {
  const run = (text) => eEval([{}], "", text);
  it("undefined", () => {
    expect(run("")).to.be.undefined;
    expect(run("a")).to.be.undefined;
  });
  it("single expression", () => {
    expect(run("result = 1 * 2 + 3 * 5 - 2 / 2")).to.equal(16);
    expect(run("result = (1 + 2) * 4")).to.equal(12);
  });
  it("function", () => {
    expect(run("inc = a => (a + 1) inc(1)")).to.equal(2);
    expect(run("sum = [a b] => (a + b) sum(1, 2.14)")).to.equal(3.14);
  });
  it("name list", () => {
    expect(run("a = {v = 1} r = a.v")).to.equal(1);
  });
  it("logical", () => {
    expect(run("a = 0 false && (a = 1) r = a")).to.equal(0);
    expect(run("a = 0 true && (a = 1) r = a")).to.equal(1);
    expect(run("a = 0 true || (a = 1) r = a")).to.equal(0);
    expect(run("a = 0 false || (a = 1) r = a")).to.equal(1);
    expect(run("a = 0 o = {f= _ => (a = 1)} false && o.f() r = a")).to.equal(0);
    expect(run("a = 0 o = {f= _ => (a = 1)} true && o.f() r = a")).to.equal(1);
    expect(run("a = 0 o = {f= _ => (a = 1)} true || o.f() r = a")).to.equal(0);
    expect(run("a = 0 o = {f= _ => (a = 1)} false || o.f() r = a")).to.equal(1);
  });
  it("concat object", () => {
    expect(eEval([{}], "", "{} + 1")).to.equal("[object Object]1");
    expect(eEval([{}], "", "1 + {}")).to.equal("1[object Object]");
    expect(eEval([{}], "", "{a = 1} + {b = 2}")).to.deep.equal({
      a: 1,
      b: 2,
    });
  });
});
