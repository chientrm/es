import { expect } from "chai";
import { EExpr, funcs } from "../EExpr.js";
import { EFunction } from "../EFunction.js";
import { EIndexing } from "../EIndexing.js";
import { EInvoke } from "../EInvoke.js";
import { EObject } from "../EObject.js";
import { ERef } from "../ERef.js";
import { ESet } from "../ESet.js";
import { ETuple } from "../ETuple.js";

describe("EObject", () => {
  it("EObject", () => {
    const o = { name: "alice", age: 12 };
    expect(new EObject(o)).to.deep.equal(o);
    expect(() => new EObject().run([])).to.throw("Not implemented");
  });

  it("ERef", () => {
    const ctxs = [{ name: "bob" }, { job: null }];
    expect(new ERef("name").run(ctxs)).to.equal(ctxs[0].name);
    expect(new ERef("age").run(ctxs)).to.be.undefined;
    expect(new ERef("age").run(ctxs)).not.to.be.null;
    expect(new ERef("job").run(ctxs)).not.to.be.undefined;
    expect(new ERef("job").run(ctxs)).to.be.null;
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
    expect(new EIndexing("a", []).run([])).to.be.undefined;
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
    expect(() => new EExpr([1, 2], ["+-+"])).to.throw("Unknown operator +-+");
    expect(new EExpr([1, 2.14], ["+"]).run([])).to.equal(3.14);
    expect(new EExpr([1, 2.5, 3.14, 5], ["+", "*", "+"]).run([])).to.equal(
      13.850000000000001
    );
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
    expect(result).to.deep.equal(3);

    result = new ETuple([
      new EExpr([new ERef("r"), 1, 2], ["=", "+"]),
      new EExpr([new ERef("r"), 5], ["+"]),
    ]).run([{}]);
    expect(result).to.deep.equal(8);
  });

  it("EFunction", () => {
    let func = new EFunction([], false).run([]);
    expect(func).to.be.instanceOf(Function);
    expect(func()).to.be.false;

    func = new EFunction([], null).run([]);
    expect(func).to.be.instanceOf(Function);
    expect(func()).to.be.null;

    func = new EFunction([], undefined).run([]);
    expect(func).to.be.instanceOf(Function);
    expect(func()).to.be.undefined;

    func = new EFunction([], Infinity).run([]);
    expect(func).to.be.instanceOf(Function);
    expect(func()).to.equal(Infinity);

    func = new EFunction([], 3.14).run([]);
    expect(func).to.be.instanceOf(Function);
    expect(func()).to.equal(3.14);

    func = new EFunction([], "Hello World").run([]);
    expect(func).to.be.instanceOf(Function);
    expect(func()).to.equal("Hello World");

    func = new EFunction([new ERef("a")], new ERef("a")).run([]);
    expect(func).to.be.instanceOf(Function);
    expect(func(3.14)).to.equal(3.14);

    func = new EFunction([new ERef("a")], new EInvoke("get", [])).run([
      { get: () => 3.14 },
    ]);
    expect(func).to.be.instanceOf(Function);
    expect(func()).to.equal(3.14);

    func = new EFunction([new ERef("a")], new EIndexing("a", [1, 2])).run([]);
    expect(func).to.be.instanceOf(Function);
    expect(
      func([
        [1, 2, 3],
        [5, 8, 13],
      ])
    ).to.equal(13);

    func = new EFunction(
      [],
      new ESet([
        new EExpr([new ERef("a"), 2], ["="]),
        new EExpr([new ERef("result"), new ERef("a"), 1.14], ["=", "+"]),
      ])
    ).run([]);
    expect(func).to.be.instanceOf(Function);
    expect(func()).to.deep.equal({
      a: 2,
      result: 3.1399999999999997,
    });

    func = new EFunction(
      [new ERef("a"), new ERef("b")],
      new ETuple([new EExpr([new ERef("a"), new ERef("b")], ["+"])])
    ).run([]);
    expect(func).to.be.instanceOf(Function);
    expect(func(1, 2.14)).to.equal(3.14);

    func = new EFunction(
      [new ERef("a"), new ERef("b")],
      new ETuple([
        new EExpr([new ERef("c"), new ERef("a"), 1], ["=", "+"]),
        new EExpr([new ERef("b"), new ERef("c")], ["+"]),
      ])
    ).run([]);
    expect(func).to.be.instanceOf(Function);
    expect(func(2, 2.14)).to.equal(5.140000000000001);

    const arr = [
      [1, 2, 3],
      [5, 8, 13],
    ];
    func = new EFunction([], arr).run([]);
    expect(func).to.be.instanceOf(Function);
    expect(func()).to.deep.equal(arr);
    expect(func()).to.equal(arr);

    const obj = { name: "alice", age: 13 };
    func = new EFunction([], obj).run([]);
    expect(func).to.be.instanceOf(Function);
    expect(func()).to.deep.equal(obj);
    expect(func()).to.equal(obj);
  });
});
