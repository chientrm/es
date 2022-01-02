import { EObject } from "./EObject.js";
import { ERef } from "./ERef.js";
import { EInvoke } from "./EInvoke.js";
import { EIndexing } from "./EIndexing.js";
import { EArray } from "./EArray.js";
import { e_error, e_impl, e_opter } from "./e_error.js";
import { e_assign } from "./e_context.js";
import { e_run } from "./e_utils.js";

const isObject = (a) => typeof a === "object" && a !== null;

export const funcs = {
  ".": {
    i: -2,
    f: (ctxs, b, a) =>
      b instanceof ERef
        ? new ERef({ obj: e_run(ctxs, a), name: b.name })
        : b instanceof EInvoke || b instanceof EIndexing
        ? e_run([...ctxs, { [b.name]: e_run(ctxs, a)[b.name] }], b)
        : `${a}.${b}` * 1,
  },
  "=>": {
    i: -1,
    f: (ctxs, b, a) => {
      a instanceof ERef && (a = new EArray([a]));
      a instanceof EArray || e_error("invalid param");
      a.operands.forEach(
        (p) =>
          (p instanceof ERef && typeof p.name === "string") ||
          e_error("invalid param")
      );
      return b instanceof EObject
        ? (...args) =>
            b.run([
              ...ctxs,
              a.operands.reduce((r, p, i) => ({ ...r, [p.name]: args[i] }), {}),
            ])
        : () => b;
    },
  },
  "*": { i: 0, f: (ctxs, b, a) => e_run(ctxs, a) * e_run(ctxs, b) },
  "/": { i: 0, f: (ctxs, b, a) => e_run(ctxs, a) / e_run(ctxs, b) },
  "%": { i: 0, f: (ctxs, b, a) => e_run(ctxs, a) % e_run(ctxs, b) },
  "+": {
    i: 1,
    f: (ctxs, b, a) => {
      const _a = e_run(ctxs, a);
      const _b = e_run(ctxs, b);
      return isObject(_a) && isObject(_b) ? { ..._a, ..._b } : _a + _b;
    },
  },
  "-": { i: 1, f: (ctxs, b, a) => e_run(ctxs, a) - e_run(ctxs, b) },
  "<<": { i: 2, f: e_impl },
  ">>": { i: 2, f: e_impl },
  ">>>": { i: 2, f: e_impl },
  "<": { i: 3, f: (ctxs, b, a) => e_run(ctxs, a) < e_run(ctxs, b) },
  "<=": { i: 3, f: (ctxs, b, a) => e_run(ctxs, a) <= e_run(ctxs, b) },
  ">": { i: 3, f: (ctxs, b, a) => e_run(ctxs, a) > e_run(ctxs, b) },
  ">=": { i: 3, f: (ctxs, b, a) => e_run(ctxs, a) >= e_run(ctxs, b) },
  in: { i: 3, f: e_impl },
  instanceof: { i: 3, f: e_impl },
  "==": { i: 4, f: e_impl },
  "!=": { i: 4, f: e_impl },
  "===": { i: 4, f: (ctxs, b, a) => e_run(ctxs, a) === e_run(ctxs, b) },
  "!==": { i: 4, f: (ctxs, b, a) => e_run(ctxs, a) !== e_run(ctxs, b) },
  "&": { i: 5, f: e_impl },
  "^": { i: 6, f: e_impl },
  "|": { i: 7, f: e_impl },
  "&&": { i: 8, f: (ctxs, b, a) => e_run(ctxs, a) && e_run(ctxs, b) },
  "||": { i: 9, f: (ctxs, b, a) => e_run(ctxs, a) || e_run(ctxs, b) },
  "=": {
    i: 10,
    f: (ctxs, b, a) => {
      a instanceof ERef || e_error("l-value must be a reference");
      return typeof a.name === "string"
        ? e_assign(ctxs, a.name, e_run(ctxs, b))
        : (a.name.obj[a.name.name] = e_run(ctxs, b));
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
