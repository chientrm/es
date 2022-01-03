import { expect } from "chai";
import { describe, it } from "mocha";
import { assign, search } from "./context.js";

describe("context", () => {
  it("search", () => {
    expect(search([{}], "a")).to.be.undefined;
    expect(search([{ a: 1 }], "a")).to.equal(1);
    expect(search([{ a: null }], "a")).to.be.null;
    expect(search([{ a: undefined }], "a")).to.be.undefined;
    expect(search([{ a: {} }], "a")).to.deep.equal({});
    const context = { a: { value: 1 } };
    expect(search([context], "a")).to.equal(context.a);
    expect(search([context], "a")).to.deep.equal(context.a);
  });

  it("assign", () => {
    const contexts = [{}];
    assign(contexts, "r", 1);
    expect(contexts).to.deep.equal([{ r: 1 }]);
  });
});
