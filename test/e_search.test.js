import { expect } from "chai";
import { e_assign, e_search } from "../e_search.js";

describe("e_search", () => {
  it("e_search", () => {
    expect(e_search([{}], "name")).to.be.undefined;
    expect(e_search([{ name: 5 }], "name")).to.equal(5);
    expect(e_search([{ name: null }], "name")).to.be.null;
  });

  it("e_assign", () => {
    let ctxs = [{}];
    e_assign(ctxs, "name", "bob");
    expect(ctxs).to.deep.equal([{ name: "bob" }]);
    ctxs = [{ result: undefined }];
    e_assign(ctxs, "result", 5);
    expect(ctxs).to.deep.equal([{ result: 5 }]);
  });
});
