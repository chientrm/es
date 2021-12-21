import { EExpr } from "./EExpr.js";
import { EIndexing } from "./EIndexing.js";
import { EInvoke } from "./EInvoke.js";
import { EObject } from "./EObject.js";
import { ERef } from "./ERef.js";
import { ESet } from "./ESet.js";
import { ETuple } from "./ETuple.js";
import { e_error } from "./e_error.js";

export class EFunction extends EObject {
  constructor(params, body) {
    params.forEach((p) => p instanceof ERef || e_error("invalid param"));
    super({ params, body });
  }
  run(ctxs) {
    if (this.body instanceof ERef)
      return (...args) => {
        const ctx = {};
        this.params.forEach((param, i) => (ctx[param.name] = args[i]));
        return this.body.run([...ctxs, ctx]);
      };
    if (this.body instanceof EInvoke)
      return (...args) => {
        const ctx = {};
        this.params.forEach((param, i) => (ctx[param.name] = args[i]));
        return this.body.run([...ctxs, ctx]);
      };
    if (this.body instanceof EIndexing)
      return (...args) => {
        const ctx = {};
        this.params.forEach((param, i) => (ctx[param.name] = args[i]));
        return this.body.run([...ctxs, ctx]);
      };
    if (this.body instanceof ESet)
      return (...args) => {
        const ctx = {};
        this.params.forEach((param, i) => (ctx[param.name] = args[i]));
        return this.body.run([...ctxs, ctx]);
      };
    if (this.body instanceof ETuple)
      return (...args) => {
        const ctx = {};
        this.params.forEach((param, i) => (ctx[param.name] = args[i]));
        return this.body.run([...ctxs, ctx]);
      };
    if (this.body instanceof EExpr)
      return (...args) => {
        const ctx = {};
        this.params.forEach((param, i) => (ctx[param.name] = args[i]));
        return this.body.run([...ctxs, ctx]);
      };
    return () => this.body;
  }
}
