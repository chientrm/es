import { expect } from "chai";
import { describe, it } from "mocha";
import { EArray } from "./EArray.js";
import { EChain } from "./EChain.js";
import { EExpression } from "./EExpression.js";
import { EIndexing } from "./EIndexing.js";
import { EInvoke } from "./EInvoke.js";
import { EReference } from "./EReference.js";
import { ETuple } from "./ETuple.js";
import { operators } from "./operators.js";

describe("operators", () => {
  const run = (operator, ctxs, a, b) => operators[operator].f(ctxs, b, a);

  describe(". chain", () => {
    it("number", () => {
      expect(run(".", [{}], 0, 14)).to.equal(0.14);
    });
    it("NaN", () => {
      expect(run(".", [{}], 0, {})).to.be.NaN;
      expect(run(".", [{}], 0, new EReference())).to.be.NaN;
    });
    it("string", () => {
      expect(run(".", [{}], "abc", new EReference("length"))).to.deep.equal({
        names: ["abc", { name: "length" }],
      });
    });
    it("array", () => {
      expect(run(".", [{}], [], new EReference("length"))).to.deep.equal({
        names: [[], { name: "length" }],
      });
    });
    it("chain", () => {
      expect(
        run(".", [{}], new EReference("a"), new EReference("b"))
      ).to.deep.equal({
        names: [{ name: "a" }, { name: "b" }],
      });
      expect(
        run(
          ".",
          [{}],
          new EChain([new EReference("a"), new EReference("b")]),
          new EReference("c")
        )
      ).to.deep.equal({
        names: [{ name: "a" }, { name: "b" }, { name: "c" }],
      });
      expect(
        run(".", [{}], new EReference("a"), new EInvoke("b", []))
      ).to.deep.equal({
        names: [{ name: "a" }, { name: "b", operands: [] }],
      });
      expect(
        run(".", [{}], new EIndexing("a", []), new EReference("b"))
      ).to.deep.equal({
        names: [{ name: "a", operands: [] }, { name: "b" }],
      });
    });
  });
  describe("=> function", () => {
    it("invalid param", () => {
      expect(() => run("=>", [{}], 0, false)()).to.throw("Unknown param 0");
      expect(() =>
        run("=>", [{}], new EArray([new EReference("a"), 0]), false)()
      ).to.throw("Unknown param 0");
    });
    it("constant", () => {
      expect(run("=>", [{}], new EReference("_"), false)()).to.be.false;
      expect(run("=>", [{}], new EReference("_"), null)()).to.be.null;
      expect(run("=>", [{}], new EReference("_"), undefined)()).to.be.undefined;
      expect(run("=>", [{}], new EReference("_"), 0)()).to.equal(0);
      expect(run("=>", [{}], new EReference("_"), "abc")()).to.deep.equal(
        "abc"
      );
      expect(run("=>", [{}], new EReference("_"), [])()).to.deep.equal([]);
      expect(run("=>", [{}], new EReference("_"), {})()).to.deep.equal({});
    });
    it("name", () => {
      expect(
        run("=>", [{ a: 1 }], new EReference("_"), new EReference("a"))()
      ).to.equal(1);
      expect(
        run(
          "=>",
          [{ f: (a) => a + 1 }],
          new EReference("a"),
          new EInvoke("f", [new EReference("a")])
        )(1)
      ).to.equal(2);
      expect(
        run(
          "=>",
          [{ a: [1, 2, 3] }],
          new EReference("i"),
          new EIndexing("a", [new EReference("i")])
        )(1)
      ).to.equal(2);
    });
    it("expression", () => {
      expect(
        run(
          "=>",
          [{}],
          new EReference("i"),
          new EExpression([new EReference("i"), 1], ["+"])
        )(1)
      ).to.equal(2);
      expect(
        run(
          "=>",
          [{}],
          new EArray([new EReference("i")]),
          new ETuple([new EExpression([new EReference("i"), 1], ["+"])])
        )(1)
      ).to.equal(2);
    });
  });
  describe("+", () => {
    it("non-object", () => {
      expect(run("+", [{}], 1, 2)).to.equal(3);
      expect(run("+", [{}], {}, 1)).to.equal("[object Object]1");
      expect(run("+", [{}], 1, {})).to.equal("1[object Object]");
    });
    it("object", () => {
      expect(run("+", [{}], { name: "bob" }, { age: 12 })).to.deep.equal({
        name: "bob",
        age: 12,
      });
    });
  });
  describe("=", () => {
    it("invalid lvalue", () => {
      expect(() => run("=", [{}], 0, 0)).to.throw(
        "Unknown lvalue [object Object]"
      );
    });
    it("l-value Reference", () => {
      const contexts = [{}];
      expect(run("=", contexts, new EReference("a"), 1)).to.equal(1);
      expect(contexts).to.deep.equal([{ a: 1 }]);
    });
    it("l-value indexing", () => {
      expect(run("=", [{ a: [1] }], new EIndexing("a", [0]), 2)).to.equal(2);
    });
    it("l-value chain", () => {
      expect(() =>
        run(
          "=",
          [{}],
          new EChain([new EReference("a"), new EReference("b")]),
          1
        ).to.throw("Cannot read properties of undefined (reading 'b')")
      );
    });
  });
  describe("+= -= *= /= %=", () => {
    it("+=", () => {
      const ctxs = [{ a: 1 }];
      expect(run("+=", ctxs, new EReference("a"), 3)).to.equal(4);
      expect(ctxs).deep.equal([{ a: 4 }]);
    });
    it("-=", () => {
      const ctxs = [{ a: 1 }];
      expect(run("-=", ctxs, new EReference("a"), 3)).to.equal(-2);
      expect(ctxs).deep.equal([{ a: -2 }]);
    });
    it("*=", () => {
      const ctxs = [{ a: 1 }];
      expect(run("*=", ctxs, new EReference("a"), 3)).to.equal(3);
      expect(ctxs).deep.equal([{ a: 3 }]);
    });
    it("/=", () => {
      const ctxs = [{ a: 1 }];
      expect(run("/=", ctxs, new EReference("a"), 3)).to.equal(1 / 3);
      expect(ctxs).deep.equal([{ a: 1 / 3 }]);
    });
    it("%=", () => {
      const ctxs = [{ a: 1 }];
      expect(run("%=", ctxs, new EReference("a"), 3)).to.equal(1 % 3);
      expect(ctxs).deep.equal([{ a: 1 % 3 }]);
    });
  });
});
