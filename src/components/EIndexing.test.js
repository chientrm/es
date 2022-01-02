import { expect } from "chai";
import { describe, it } from "mocha";
import { EIndexing } from "./EIndexing.js";

describe("EIndexing", () => {
  const contexts = [
    {
      a: [[0, 1, 3], [5, 8], undefined],
    },
  ];
  const run = (name, indices, ctxs) => new EIndexing(name, indices).run(ctxs);
  it("undefined indexing", () => {
    expect(run("a", [], [{}])).to.be.undefined;
  });
  it("empty indexing", () => {
    expect(run("a", [], contexts)).to.deep.equal(contexts[0].a);
    expect(run("a", [], contexts)).to.equal(contexts[0].a);
  });
  it("1 value indexing", () => {
    expect(run("a", [0], contexts)).to.deep.equal(contexts[0].a[0]);
    expect(run("a", [0], contexts)).to.equal(contexts[0].a[0]);
  });
  it("2 value indexing", () => {
    expect(run("a", [0, 2], contexts)).to.equal(3);
  });
  it("negative value indexing", () => {
    expect(run("a", [-1], contexts)).to.be.undefined;
  });
  it("out of range indexing", () => {
    expect(run("a", [1, 3], contexts)).to.be.undefined;
  });
  it("indexing return undefined", () => {
    expect(run("a", [2], contexts)).to.be.undefined;
  });
});
