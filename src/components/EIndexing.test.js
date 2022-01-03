import { expect } from "chai";
import { describe, it } from "mocha";
import { EIndexing } from "./EIndexing.js";

describe("EIndexing", () => {
  describe("run", () => {
    const run = (contexts, name, indices) =>
      new EIndexing(name, indices).run(contexts);
    const contexts = [
      {
        a: [[0, 1, 3], [5, 8], undefined],
      },
    ];
    it("undefined indexing", () => {
      expect(run([{}], "a", [])).to.be.undefined;
    });
    it("empty indexing", () => {
      expect(run(contexts, "a", [])).to.deep.equal(contexts[0].a);
      expect(run(contexts, "a", [])).to.equal(contexts[0].a);
    });
    it("1 value indexing", () => {
      expect(run(contexts, "a", [0])).to.deep.equal(contexts[0].a[0]);
      expect(run(contexts, "a", [0])).to.equal(contexts[0].a[0]);
    });
    it("2 value indexing", () => {
      expect(run(contexts, "a", [0, 2])).to.equal(3);
    });
    it("negative value indexing", () => {
      expect(run(contexts, "a", [-1])).to.be.undefined;
    });
    it("out of range indexing", () => {
      expect(run(contexts, "a", [1, 3])).to.be.undefined;
    });
    it("indexing return undefined", () => {
      expect(run(contexts, "a", [2])).to.be.undefined;
    });
  });
  describe("assign", () => {
    const assign = (contexts, name, operands, value) =>
      new EIndexing(name, operands).assign(contexts, value);
    it("invalid indexing", () => {
      expect(() => assign([{ a: 1 }], "a", [0], 1)).to.throw(
        "Cannot create property '0' on number '1'"
      );
    });
    it("empty indexing", () => {
      const contexts = [{ a: 0 }];
      expect(assign(contexts, "a", [], 1)).to.equal(1);
      expect(contexts).to.deep.equal([{ a: 1 }]);
    });
    it("1 value indexing", () => {
      const contexts = [{ a: [0, 1] }];
      expect(assign(contexts, "a", [1], 2)).to.equal(2);
      expect(contexts).to.deep.equal([{ a: [0, 2] }]);
    });
    it("2 value indexing", () => {
      const contexts = [
        {
          a: [
            [0, 1],
            [2, 3],
          ],
        },
      ];
      expect(assign(contexts, "a", [1, 0], 4)).to.equal(4);
      expect(contexts).to.deep.equal([
        {
          a: [
            [0, 1],
            [4, 3],
          ],
        },
      ]);
    });
  });
});
