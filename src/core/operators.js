import {
  EArray,
  EIndexing,
  EInvoke,
  EObject,
  EReference,
  eRun,
  isObject,
} from "../components/index.js";
import { assign } from "./context.js";
import { notImplemented, invalidParam, invalidLvalue } from "./error.js";

export const operators = {
  ".": {
    i: -2,
    f: (ctxs, b, a) =>
      b instanceof EReference
        ? new EReference({ obj: eRun(ctxs, a), name: b.name })
        : b instanceof EInvoke || b instanceof EIndexing
        ? eRun([...ctxs, { [b.name]: eRun(ctxs, a)[b.name] }], b)
        : `${a}.${b}` * 1,
  },
  "=>": {
    i: -1,
    f: (ctxs, b, a) => {
      a instanceof EReference && (a = new EArray([a]));
      a instanceof EArray || invalidParam(a);
      a.operands.forEach(
        (p) =>
          (p instanceof EReference && typeof p.name === "string") ||
          invalidParam(p)
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
  "*": { i: 0, f: (ctxs, b, a) => eRun(ctxs, a) * eRun(ctxs, b) },
  "/": { i: 0, f: (ctxs, b, a) => eRun(ctxs, a) / eRun(ctxs, b) },
  "%": { i: 0, f: (ctxs, b, a) => eRun(ctxs, a) % eRun(ctxs, b) },
  "+": {
    i: 1,
    f: (ctxs, b, a) => {
      const _a = eRun(ctxs, a);
      const _b = eRun(ctxs, b);
      return isObject(_a) && isObject(_b) ? { ..._a, ..._b } : _a + _b;
    },
  },
  "-": { i: 1, f: (ctxs, b, a) => eRun(ctxs, a) - eRun(ctxs, b) },
  "<<": { i: 2, f: () => notImplemented("<<") },
  ">>": { i: 2, f: () => notImplemented(">>") },
  ">>>": { i: 2, f: () => notImplemented(">>>") },
  "<": { i: 3, f: (ctxs, b, a) => eRun(ctxs, a) < eRun(ctxs, b) },
  "<=": { i: 3, f: (ctxs, b, a) => eRun(ctxs, a) <= eRun(ctxs, b) },
  ">": { i: 3, f: (ctxs, b, a) => eRun(ctxs, a) > eRun(ctxs, b) },
  ">=": { i: 3, f: (ctxs, b, a) => eRun(ctxs, a) >= eRun(ctxs, b) },
  in: { i: 3, f: () => notImplemented("in") },
  instanceof: { i: 3, f: () => notImplemented("instanceof") },
  "==": { i: 4, f: () => notImplemented("==") },
  "!=": { i: 4, f: () => notImplemented("!=") },
  "===": { i: 4, f: (ctxs, b, a) => eRun(ctxs, a) === eRun(ctxs, b) },
  "!==": { i: 4, f: (ctxs, b, a) => eRun(ctxs, a) !== eRun(ctxs, b) },
  "&": { i: 5, f: () => notImplemented("&") },
  "^": { i: 6, f: () => notImplemented("^") },
  "|": { i: 7, f: () => notImplemented("|") },
  "&&": { i: 8, f: (ctxs, b, a) => eRun(ctxs, a) && eRun(ctxs, b) },
  "||": { i: 9, f: (ctxs, b, a) => eRun(ctxs, a) || eRun(ctxs, b) },
  "=": {
    i: 10,
    f: (ctxs, b, a) => {
      a instanceof EReference || invalidLvalue(a);
      return typeof a.name === "string"
        ? assign(ctxs, a.name, eRun(ctxs, b))
        : (a.name.obj[a.name.name] = eRun(ctxs, b));
    },
  },
  "+=": { i: 10, f: () => notImplemented("+=") },
  "-=": { i: 10, f: () => notImplemented("-=") },
  "*=": { i: 10, f: () => notImplemented("*=") },
  "/=": { i: 10, f: () => notImplemented("/=") },
  "%=": { i: 10, f: () => notImplemented("%=") },
  "<<=": { i: 10, f: () => notImplemented("<<=") },
  ">>=": { i: 10, f: () => notImplemented(">>=") },
  ">>>=": { i: 10, f: () => notImplemented(">>>=") },
  "&=": { i: 10, f: () => notImplemented("&=") },
  "^=": { i: 10, f: () => notImplemented("^=") },
  "|=": { i: 10, f: () => notImplemented("|=") },
  "&&=": { i: 10, f: () => notImplemented("&&=") },
  "||=": { i: 10, f: () => notImplemented("||=") },
  "??=": { i: 10, f: () => notImplemented("??=") },
};
