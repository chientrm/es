import { invalidLvalue, invalidParam, notImplemented } from "../core/error.js";
import { EArray } from "./EArray.js";
import { EName } from "./EName.js";
import { ENameList } from "./ENameList.js";
import { EObject } from "./EObject.js";
import { EReference } from "./EReference.js";
import { eRun, isObject } from "./utils.js";

export const operators = {
  ".": {
    i: -2,
    f: (_, b, a) =>
      a instanceof EName && b instanceof EName
        ? new ENameList([...(a instanceof ENameList ? a.names : [a]), b])
        : `${a}.${b}` * 1,
  },
  "=>": {
    i: -1,
    f: (ctxs, b, a) => {
      a instanceof EReference && (a = new EArray([a]));
      a instanceof EArray || invalidParam(a);
      a.operands.forEach((p) => p instanceof EReference || invalidParam(p));
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
      a instanceof ENameList || (a = new ENameList([a]));
      a.names.forEach((name) => name instanceof EName || invalidLvalue(a));
      return a.assign(ctxs, eRun(ctxs, b));
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
