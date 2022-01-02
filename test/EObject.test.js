import { expect } from "chai";
import { describe, it } from "mocha";
import {
  EArray,
  EExpression,
  EIndexing,
  EInvoke,
  EObject,
  EReference,
  ESet,
  ETuple,
} from "../src/components/index.js";
import { operators } from "../src/core/index.js";

describe("EObject", () => {
  it("EObject", () => {
    const o = { name: "alice", age: 12 };
    expect(new EObject(o)).to.deep.equal(o);
    expect(() => new EObject().run([])).to.throw(
      "EObject.run is not implemented"
    );
  });

  it("ERef", () => {
    const ctxs = [{ name: "bob" }, { job: null }, { gender: "male" }];
    expect(new EReference("name").run(ctxs)).to.equal("bob");
    expect(new EReference("age").run(ctxs)).to.be.undefined;
    expect(new EReference("age").run(ctxs)).not.to.be.null;
    expect(new EReference("job").run(ctxs)).not.to.be.undefined;
    expect(new EReference("job").run(ctxs)).to.be.null;
    expect(new EReference({ obj: ctxs[2], name: "gender" }).run([{}])).to.equal(
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
    expect(new EExpression([1, 2, 3, 4], ["+", "*", "+"])).to.deep.equal({
      postfix: [
        1,
        2,
        3,
        operators["*"].f,
        operators["+"].f,
        4,
        operators["+"].f,
      ],
    });
    expect(() => new EExpression([1, 2], ["="]).run([])).to.throw(
      "Unknown lvalue 1"
    );
    expect(() => new EExpression([1, 2], ["=>"]).run([])).to.throw(
      "Unknown param 1"
    );
    expect(() =>
      new EExpression([new EReference({}), 2], ["=>"]).run([])
    ).to.throw("Unknown param [object Object]");
    expect(
      new EExpression([new EReference("a"), 2], ["=>"]).run([{}])()
    ).to.equal(2);
    expect(new EExpression([new EReference("a"), 2], ["="]).run([{}])).to.equal(
      2
    );
    expect(() => new EExpression([1, 2], ["+-+"])).to.throw(
      "Unknown operator +-+"
    );
    expect(new EExpression([1, 14], ["."]).run([])).to.equal(1.14);
    expect(new EExpression([1, 2, 14], ["+", "."]).run([])).to.equal(3.14);
    expect(
      new EExpression([1, 2.5, 3.14, 5], ["+", "*", "+"]).run([])
    ).to.equal(13.850000000000001);
    expect(new EExpression([1, 2], ["<"]).run([])).to.be.true;
    expect(new EExpression([1, 2], ["<="]).run([])).to.be.true;
    expect(new EExpression([1, 2], [">"]).run([])).to.be.false;
    expect(new EExpression([2, 2], [">="]).run([])).to.be.true;
    expect(new EExpression([2, 2], ["==="]).run([])).to.be.true;
    expect(new EExpression([2, "2"], ["==="]).run([])).to.be.false;
    expect(new EExpression([1, 2], ["!=="]).run([])).to.be.true;
    expect(new EExpression([true, false], ["&&"]).run([])).to.be.false;
    expect(new EExpression([true, false], ["||"]).run([])).to.be.true;
  });

  it("ESet", () => {
    let result = new ESet([]).run([]);
    expect(result).to.deep.equal({});

    result = new ESet([
      new EExpression([new EReference("r"), 1, 2], ["=", "+"]),
    ]).run([]);
    expect(result).to.deep.equal({ r: 3 });

    result = new ESet([
      new EExpression([new EReference("a"), 1, 2], ["=", "+"]),
      new EExpression([new EReference("b"), 1, 2], ["=", "*"]),
    ]).run([]);
    expect(result).to.deep.equal({ a: 3, b: 2 });
  });

  it("ETuple", () => {
    let result = new ETuple([]).run([{}]);
    expect(result).to.be.undefined;

    result = new ETuple([
      new EExpression([new EReference("r"), 1, 2], ["=", "+"]),
    ]).run([{}]);
    expect(result).to.equal(3);

    result = new ETuple([
      new EExpression([new EReference("r"), 1, 2], ["=", "+"]),
      new EExpression([new EReference("r"), 5], ["+"]),
    ]).run([{}]);
    expect(result).to.equal(8);

    const ctxs = [{}];
    result = new ETuple([
      new EExpression([new EReference("student"), {}], ["="]),
      new EExpression(
        [new EReference("student"), new EReference("name"), "alice"],
        [".", "="]
      ),
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
      new EExpression(
        [
          new EReference("result"),
          new EInvoke("getStudent", []),
          new EReference("name"),
        ],
        ["=", "."]
      ),
    ]).run([{ getStudent: () => ({ name: "bob" }) }]);
    expect(result).to.equal("bob");

    result = new ETuple([
      new EExpression(
        [new EInvoke("getStudent", []), new EReference("name"), "alice"],
        [".", "="]
      ),
    ]).run([{ getStudent: () => ({ name: "bob" }) }]);
    expect(result).to.equal("alice");

    result = new ETuple([
      new EExpression(
        [new EIndexing("students", [0]), new EReference("name"), "alice"],
        [".", "="]
      ),
    ]).run([{ students: [{ name: "bob" }, { name: "ace" }] }]);
    expect(result).to.equal("alice");
  });

  it("EArray", () => {
    let result = new EArray([]).run([{}]);
    expect(result).to.deep.equal([]);

    result = new EArray([new EReference("name")]).run([{ name: "alice" }]);
    expect(result).to.deep.equal(["alice"]);
  });
});
