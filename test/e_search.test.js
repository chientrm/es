import { expect } from "chai";
import { e_assign, e_search } from "../e_search.js";

describe("e_search", () => {
  it("e_search", () => {
    expect(e_search([{}], "name")).to.be.undefined;
    expect(e_search([{ name: 5 }], "name")).to.equal(5);
    expect(e_search([{ name: null }], "name")).to.be.null;
    expect(e_search([{ name: undefined }], "name")).to.be.undefined;
    expect(e_search([{}], "student.name")).to.be.undefined;
    expect(e_search([{ student: {} }], "student.name")).to.be.undefined;
    expect(e_search([{ student: { name: undefined } }], "student.name")).to.be
      .undefined;
    expect(e_search([{ student: { name: "alice" } }], "student.name")).to.equal(
      "alice"
    );
  });

  it("e_assign", () => {
    let ctxs = [{}];
    e_assign(ctxs, "name", "bob");
    expect(ctxs).to.deep.equal([{ name: "bob" }]);
    ctxs = [{}];
    e_assign(ctxs, "result", 5);
    expect(ctxs).to.deep.equal([{ result: 5 }]);
    ctxs = [{}];
    e_assign(ctxs, "student.name", 5);
    expect(ctxs).to.deep.equal([{}]);
    ctxs = [{}];
    e_assign(ctxs, "student", {});
    e_assign(ctxs, "student.name", "alice");
    expect(ctxs).to.deep.equal([{ student: { name: "alice" } }]);
  });
});
