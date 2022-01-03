import { expect } from "chai";
import { describe, it } from "mocha";
import { ENameList } from "./ENameList.js";
import { EReference } from "./EReference.js";
import { EIndexing } from "./EIndexing.js";

describe("ENameList", () => {
  describe("run", () => {
    const run = (contexts, names) => new ENameList(names).run(contexts);
    it("undefined", () => {
      expect(run([{}], [new EReference("a")])).to.be.undefined;
      expect(run([{ a: 1 }], [new EReference("a"), new EReference("b")])).to.be
        .undefined;
      expect(() =>
        run([{}], [new EReference("a"), new EReference("b")])
      ).to.throw("read properties of undefined (reading 'b')");
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
      new ENameList(names).assign(contexts, value);
    it("undefined", () => {
      const contexts = [{}];
      expect(() =>
        assign(contexts, [new EReference("a"), new EReference("b")], 1)
      ).to.throw("Cannot read properties of undefined (reading 'b')");
    });
    it("1 reference", () => {
      const contexts = [{}];
      expect(assign(contexts, [new EReference("a")], 1)).to.equal(1);
      expect(contexts).to.deep.equal([{ a: 1 }]);
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
