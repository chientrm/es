import { EFunction } from "./EFunction.js";
import { EObject } from "./EObject.js";
import { ERef } from "./ERef.js";
import { ESet } from "./ESet.js";
import { e_error, e_impl, e_opter } from "./e_error.js";
import { e_assign } from "./e_search.js";

const run = (ctxs, o) => (o instanceof EObject ? o.run(ctxs) : o);

export const funcs = {
  "=>": {
    i: -1,
    f: (ctxs, b, a) => {
      Array.isArray(a) || e_error("", 1, "function params missing");
      b instanceof ESet || e_error("", 1, "function body missing");
      return new EFunction(a, b);
    },
  },
  "*": { i: 0, f: (ctxs, b, a) => run(ctxs, a) * run(ctxs, b) },
  "/": { i: 0, f: (ctxs, b, a) => run(ctxs, a) / run(ctxs, b) },
  "%": { i: 0, f: (ctxs, b, a) => run(ctxs, a) % run(ctxs, b) },
  "+": { i: 1, f: (ctxs, b, a) => run(ctxs, a) + run(ctxs, b) },
  "-": { i: 1, f: (ctxs, b, a) => run(ctxs, a) - run(ctxs, b) },
  "<<": { i: 2, f: e_impl },
  ">>": { i: 2, f: e_impl },
  ">>>": { i: 2, f: e_impl },
  "<": { i: 3, f: e_impl },
  "<=": { i: 3, f: e_impl },
  ">": { i: 3, f: e_impl },
  ">=": { i: 3, f: e_impl },
  in: { i: 3, f: e_impl },
  instanceof: { i: 3, f: e_impl },
  "==": { i: 4, f: e_impl },
  "!=": { i: 4, f: e_impl },
  "===": { i: 4, f: e_impl },
  "!==": { i: 4, f: e_impl },
  "&": { i: 5, f: e_impl },
  "^": { i: 6, f: e_impl },
  "|": { i: 7, f: e_impl },
  "&&": { i: 8, f: e_impl },
  "||": { i: 9, f: e_impl },
  "=": {
    i: 10,
    f: (ctxs, b, a) => {
      a instanceof ERef || e_error("l-value must be a reference");
      e_assign(ctxs, a.name, run(ctxs, b));
      return run(ctxs, a);
    },
  },
  "+=": { i: 10, f: e_impl },
  "-=": { i: 10, f: e_impl },
  "*=": { i: 10, f: e_impl },
  "/=": { i: 10, f: e_impl },
  "%=": { i: 10, f: e_impl },
  "<<=": { i: 10, f: e_impl },
  ">>=": { i: 10, f: e_impl },
  ">>>=": { i: 10, f: e_impl },
  "&=": { i: 10, f: e_impl },
  "^=": { i: 10, f: e_impl },
  "|=": { i: 10, f: e_impl },
  "&&=": { i: 10, f: e_impl },
  "||=": { i: 10, f: e_impl },
  "??=": { i: 10, f: e_impl },
};

class Node extends EObject {
  constructor(left, right, func) {
    super({ left, right, func });
  }
  fix() {
    if (this.left instanceof Node && this.left.func.i > this.func.i) {
      const tmp = this.left;
      this.left = this.left.right;
      tmp.right = this.fix();
      return tmp;
    }
    return this;
  }
  post(p) {
    const _p1 = (o) => (o instanceof EExpr ? p.push(...o.postfix) : p.push(o));
    const _p2 = (o) => (o instanceof Node ? o.post(p) : _p1(o));
    _p2(this.left);
    _p2(this.right);
    p.push(this.func.f);
  }
}

export class EExpr extends EObject {
  constructor(operands, operators) {
    let node = operands[0];
    operators.forEach((operator, i) => {
      funcs[operator] || e_opter(operator);
      node = new Node(node, operands[i + 1], funcs[operator]);
      node = node.fix();
    });
    const postfix = [];
    node.post(postfix);
    super({ postfix });
  }
  run(ctxs) {
    const stack = [];
    this.postfix.forEach((p) =>
      typeof p === "function"
        ? stack.push(p(ctxs, stack.pop(), stack.pop()))
        : stack.push(p)
    );
    return stack.pop();
  }
}
