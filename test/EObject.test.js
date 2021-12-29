import { expect } from "chai";
import { EExpr, funcs } from "../src/EExpr.js";
import { EIndexing } from "../src/EIndexing.js";
import { EInvoke } from "../src/EInvoke.js";
import { EObject } from "../src/EObject.js";
import { ERef } from "../src/ERef.js";
import { ESet } from "../src/ESet.js";
import { ETuple } from "../src/ETuple.js";
import { EArray } from "../src/EArray.js";

describe("EObject", () => {
  it("EObject", () => {
    const o = { name: "alice", age: 12 };
    expect(new EObject(o)).to.deep.equal(o);
    expect(() => new EObject().run([])).to.throw("Not implemented");
  });

  it("ERef", () => {
    const ctxs = [{ name: "bob" }, { job: null }, { gender: "male" }];
    expect(new ERef("name").run(ctxs)).to.equal("bob");
    expect(new ERef("age").run(ctxs)).to.be.undefined;
    expect(new ERef("age").run(ctxs)).not.to.be.null;
    expect(new ERef("job").run(ctxs)).not.to.be.undefined;
    expect(new ERef("job").run(ctxs)).to.be.null;
    expect(new ERef({ obj: ctxs[2], name: "gender" }).run([{}])).to.equal(
      "male"
    );
  });

  it("EInvoke", () => {
    expect(
      new EInvoke("add", [1, 2.3]).run([{ add: (a, b) => a + b }])
    ).to.equal(3.3);
  });

  it("EIndexing", () => {
    const ctxs = [
      {
        a: [[0, 1, 3], [5, 8], undefined],
      },
    ];
    expect(new EIndexing("a", []).run([{}])).to.be.undefined;
    expect(new EIndexing("a", []).run(ctxs)).to.deep.equal(ctxs[0].a);
    expect(new EIndexing("a", []).run(ctxs)).to.equal(ctxs[0].a);
    expect(new EIndexing("a", [0]).run(ctxs)).to.deep.equal(ctxs[0].a[0]);
    expect(new EIndexing("a", [0]).run(ctxs)).to.equal(ctxs[0].a[0]);
    expect(new EIndexing("a", [0, 2]).run(ctxs)).to.equal(3);
    expect(new EIndexing("a", [-1]).run(ctxs)).to.be.undefined;
    expect(new EIndexing("a", [1, 3]).run(ctxs)).to.be.undefined;
    expect(new EIndexing("a", [2]).run(ctxs)).to.be.undefined;
  });

  it("EExpr", () => {
    expect(new EExpr([1, 2, 3, 4], ["+", "*", "+"])).to.deep.equal({
      postfix: [1, 2, 3, funcs["*"].f, funcs["+"].f, 4, funcs["+"].f],
    });
    expect(() => new EExpr([1, 2], ["="]).run([])).to.throw(
      "l-value must be a reference"
    );
    expect(() => new EExpr([1, 2], ["=>"]).run([])).to.throw("invalid param");
    expect(() => new EExpr([new ERef({}), 2], ["=>"]).run([])).to.throw(
      "invalid param"
    );
    expect(new EExpr([new ERef("a"), 2], ["=>"]).run([{}])()).to.equal(2);
    expect(new EExpr([new ERef("a"), 2], ["="]).run([{}])).to.equal(2);
    expect(() => new EExpr([1, 2], ["+-+"])).to.throw("Unknown operator +-+");
    expect(new EExpr([1, 14], ["."]).run([])).to.equal(1.14);
    expect(new EExpr([1, 2, 14], ["+", "."]).run([])).to.equal(3.14);
    expect(new EExpr([1, 2.5, 3.14, 5], ["+", "*", "+"]).run([])).to.equal(
      13.850000000000001
    );
    expect(new EExpr([1, 2], ["<"]).run([])).to.be.true;
    expect(new EExpr([1, 2], ["<="]).run([])).to.be.true;
    expect(new EExpr([1, 2], [">"]).run([])).to.be.false;
    expect(new EExpr([2, 2], [">="]).run([])).to.be.true;
    expect(new EExpr([2, 2], ["==="]).run([])).to.be.true;
    expect(new EExpr([2, "2"], ["==="]).run([])).to.be.false;
    expect(new EExpr([1, 2], ["!=="]).run([])).to.be.true;
    expect(new EExpr([true, false], ["&&"]).run([])).to.be.false;
    expect(new EExpr([true, false], ["||"]).run([])).to.be.true;
  });

  it("ESet", () => {
    let result = new ESet([]).run([]);
    expect(result).to.deep.equal({});

    result = new ESet([new EExpr([new ERef("r"), 1, 2], ["=", "+"])]).run([]);
    expect(result).to.deep.equal({ r: 3 });

    result = new ESet([
      new EExpr([new ERef("a"), 1, 2], ["=", "+"]),
      new EExpr([new ERef("b"), 1, 2], ["=", "*"]),
    ]).run([]);
    expect(result).to.deep.equal({ a: 3, b: 2 });
  });

  it("ETuple", () => {
    let result = new ETuple([]).run([{}]);
    expect(result).to.be.undefined;

    result = new ETuple([new EExpr([new ERef("r"), 1, 2], ["=", "+"])]).run([
      {},
    ]);
    expect(result).to.equal(3);

    result = new ETuple([
      new EExpr([new ERef("r"), 1, 2], ["=", "+"]),
      new EExpr([new ERef("r"), 5], ["+"]),
    ]).run([{}]);
    expect(result).to.equal(8);

    const ctxs = [{}];
    result = new ETuple([
      new EExpr([new ERef("student"), {}], ["="]),
      new EExpr([new ERef("student"), new ERef("name"), "alice"], [".", "="]),
    ]).run(ctxs);
    expect(result).to.equal("alice");
    expect(ctxs).to.deep.equal([
      {
        student: {
          name: "alice",
        },
      },
    ]);

    result = new ETuple([
      new EExpr(
        [new ERef("result"), new EInvoke("getStudent", []), new ERef("name")],
        ["=", "."]
      ),
    ]).run([{ getStudent: () => ({ name: "bob" }) }]);
    expect(result).to.equal("bob");

    result = new ETuple([
      new EExpr(
        [new EInvoke("getStudent", []), new ERef("name"), "alice"],
        [".", "="]
      ),
    ]).run([{ getStudent: () => ({ name: "bob" }) }]);
    expect(result).to.equal("alice");

    result = new ETuple([
      new EExpr(
        [new EIndexing("students", [0]), new ERef("name"), "alice"],
        [".", "="]
      ),
    ]).run([{ students: [{ name: "bob" }, { name: "ace" }] }]);
    expect(result).to.equal("alice");
  });

  it("EArray", () => {
    let result = new EArray([]).run([{}]);
    expect(result).to.deep.equal([]);

    result = new EArray([new ERef("name")]).run([{ name: "alice" }]);
    expect(result).to.deep.equal(["alice"]);
  });
});
