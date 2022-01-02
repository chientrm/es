import { expect } from "chai";
import { describe, it } from "mocha";
import { search, assign } from "../src/core/index.js";

describe("e_search", () => {
  it("e_search", () => {
    expect(search([{}], "name")).to.be.undefined;
    expect(search([{ name: 5 }], "name")).to.equal(5);
    expect(search([{ name: null }], "name")).to.be.null;
    expect(search([{ name: undefined }], "name")).to.be.undefined;
    expect(search([{}], "student")).to.be.undefined;
    expect(search([{ student: {} }], "student")).to.deep.equal({});
    const ctx = { student: { name: undefined } };
    expect(search([ctx], "student")).to.equal(ctx.student);
    expect(search([ctx], "student")).to.deep.equal(ctx.student);
  });

  it("e_assign", () => {
    let ctxs = [{}];
    assign(ctxs, "name", "bob");
    expect(ctxs).to.deep.equal([{ name: "bob" }]);
    ctxs = [{}];
    assign(ctxs, "result", 5);
    expect(ctxs).to.deep.equal([{ result: 5 }]);
  });
});
