import { expect } from "chai";
import { describe, it } from "mocha";
import { EReference } from "./EReference.js";

describe("EReference", () => {
  describe("run", () => {
    const run = (ctxs, name) => new EReference(name).run(ctxs);
    it("undefined", () => {
      expect(run([{}], "a")).to.be.undefined;
      expect(run([{ a: undefined }], "a")).to.be.undefined;
    });
    it("valid", () => {
      expect(run([{ a: 1 }], "a")).to.equal(1);
    });
  });
  describe("assign", () => {
    const assign = (ctxs, name, value) =>
      new EReference(name).assign(ctxs, value);
    it("valid", () => {
      const contexts = [{}];
      expect(assign(contexts, "a", 1)).to.equal(1);
      expect(contexts).to.deep.equals([{ a: 1 }]);
    });
  });
});
