import { expect } from "chai";
import { EExpr } from "../EExpr.js";
import { EIndexing } from "../EIndexing.js";
import { EInvoke } from "../EInvoke.js";
import { EObject } from "../EObject.js";
import { ERef } from "../ERef.js";
import { ESet } from "../ESet.js";

describe("EObject", () => {
  it("EObject", () => {
    const o = { name: "alice", age: 12 };
    expect(new EObject(o)).to.deep.equal(o);
    expect(() => new EObject().run()).to.throw("Not implemented");
  });

  it("ERef", () => {
    const ctxs = [{ name: "bob" }, { job: null }];
    expect(new ERef("name").run(ctxs)).to.equal(ctxs[0].name);
    expect(new ERef("age").run(ctxs)).to.be.undefined;
    expect(new ERef("age").run(ctxs)).not.to.be.null;
    expect(new ERef("job").run(ctxs)).not.to.be.undefined;
    expect(new ERef("job").run(ctxs)).to.be.null;
  });

  it("EInvoke", () => {
    expect(
      new EInvoke("add", [1, 2.3]).run([{ add: (a, b) => a + b }])
    ).to.equal(3.3);
  });

  it("EIndexing", () => {
    const ctxs = [
      {
        a: [
          [0, 1, 3],
          [5, 8, 13],
        ],
      },
    ];
    expect(new EIndexing("a", [1, 2]).run(ctxs)).to.equal(13);
    expect(() => new EIndexing("a", [3, 0]).run(ctxs)).to.throw("Out of range");
    expect(() => new EIndexing("a", [1, 3]).run(ctxs)).to.throw("Out of range");
  });

  it("EExpr", () => {
    expect(new EExpr([1, 2.14], ["+"]).run([])).to.equal(3.14);
  });

  it("ESet", () => {
    const set = new ESet([
      { operands: ["a", 3], operators: ["="] },
      { operands: ["result", "a", "2"], operators: ["=", "+"] },
    ]);
    expect(set.run([])).to.equal(2);
  });
});
