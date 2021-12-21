import { EObject } from "./EObject.js";
import { ERef } from "./ERef.js";
import { e_error } from "./e_error.js";

export class EFunction extends EObject {
  constructor(params, body) {
    params.forEach((p) => p instanceof ERef || e_error("invalid param"));
    super({ params, body });
  }
  run(ctxs) {
    return this.body instanceof EObject
      ? (...args) =>
          this.body.run([
            ...ctxs,
            this.params.reduce((r, p, i) => ({ ...r, [p.name]: args[i] }), {}),
          ])
      : () => this.body;
  }
}
