import { expect } from "chai";
import { describe, it } from "mocha";
import { EIndexing } from "./EIndexing.js";
import { EInvoke } from "./EInvoke.js";
import { EChain } from "./EChain.js";
import { EReference } from "./EReference.js";

describe("EChain", () => {
  describe("run", () => {
    const run = (contexts, names) => new EChain(names).run(contexts);
    it("invalid", () => {
      expect(() => run([{}], [[], 1])).to.throw("Unknown chain 1");
    });
    it("undefined", () => {
      expect(run([{ a: 1 }], [new EReference("a"), new EReference("b")])).to.be
        .undefined;
      expect(() =>
        run([{}], [new EReference("a"), new EReference("b")])
      ).to.throw("read properties of undefined (reading 'b')");
    });
    it("string", () => {
      expect(run([{}], ["abc", new EInvoke("includes", ["a"])])).to.be.true;
      expect(
        run(
          [{ s: "abc" }],
          [new EReference("s"), new EInvoke("includes", ["a"])]
        )
      ).to.be.true;
    });
    it("array", () => {
      expect(
        run(
          [{ f: (a) => a * 2 }],
          [[2, 3], new EInvoke("map", [new EReference("f")])]
        )
      ).to.deep.equal([4, 6]);
      expect(
        run(
          [{ a: [2, 3], f: (i) => i * 2 }],
          [new EReference("a"), new EInvoke("map", [new EReference("f")])]
        )
      ).to.deep.equal([4, 6]);
    });
    it("1 reference", () => {
      const contexts = [{ a: 1 }];
      expect(run(contexts, [new EReference("a")])).to.equal(1);
    });
    it("2 references", () => {
      expect(
        run([{ a: { b: 1 } }], [new EReference("a"), new EReference("b")])
      ).to.equal(1);
    });
  });
  describe("assign", () => {
    const assign = (contexts, names, value) =>
      new EChain(names).assign(contexts, value);
    it("undefined", () => {
      const contexts = [{}];
      expect(() =>
        assign(contexts, [new EReference("a"), new EReference("b")], 1)
      ).to.throw("Cannot set properties of undefined (setting 'b')");
    });
    it("string", () => {
      expect(() => assign([{}], ["", new EReference("a")], 1)).to.throw(
        "Cannot create property 'a' on string ''"
      );
    });
    it("array", () => {
      expect(assign([{}], [[], new EReference("a")], 1)).to.equal(1);
    });
    it("2 references", () => {
      const contexts = [{ a: {} }];
      expect(
        assign(contexts, [new EReference("a"), new EReference("b")], 1)
      ).to.equal(1);
      expect(contexts).to.deep.equal([{ a: { b: 1 } }]);
    });
    it("3 references", () => {
      const contexts = [{ a: { b: {} } }];
      expect(
        assign(
          contexts,
          [new EReference("a"), new EReference("b"), new EReference("c")],
          1
        )
      ).to.equal(1);
      expect(contexts).to.deep.equal([{ a: { b: { c: 1 } } }]);
    });
    it("2 references and 1 indexing", () => {
      const contexts = [{ a: { b: { c: [0] } } }];
      expect(
        assign(
          contexts,
          [new EReference("a"), new EReference("b"), new EIndexing("c", [0])],
          1
        )
      ).to.equal(1);
      expect(contexts).to.deep.equal([{ a: { b: { c: [1] } } }]);
    });
  });
});
