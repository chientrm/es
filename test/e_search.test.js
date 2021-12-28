import { expect } from "chai";
import { e_assign, e_search } from "../e_search.js";

describe("e_search", () => {
  it("e_search", () => {
    expect(e_search([{}], "name")).to.be.undefined;
    expect(e_search([{ name: 5 }], "name")).to.equal(5);
    expect(e_search([{ name: null }], "name")).to.be.null;
    expect(e_search([{ name: undefined }], "name")).to.be.undefined;
    expect(e_search([{}], "student")).to.be.undefined;
    expect(e_search([{ student: {} }], "student")).to.deep.equal({});
    const ctx = { student: { name: undefined } };
    expect(e_search([ctx], "student")).to.equal(ctx.student);
    expect(e_search([ctx], "student")).to.deep.equal(ctx.student);
  });

  it("e_assign", () => {
    let ctxs = [{}];
    e_assign(ctxs, "name", "bob");
    expect(ctxs).to.deep.equal([{ name: "bob" }]);
    ctxs = [{}];
    e_assign(ctxs, "result", 5);
    expect(ctxs).to.deep.equal([{ result: 5 }]);
  });
});
