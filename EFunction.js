import { EObject } from "./EObject.js";
import { ERef } from "./ERef.js";
import { e_error } from "./e_error.js";

export class EFunction extends EObject {
  constructor(params, body) {
    params.forEach((p) => p instanceof ERef || e_error("invalid param"));
    super({ params, body });
  }
  run(ctxs) {
    return (...args) => {
      const ctx = { result: undefined };
      this.params.forEach((param, i) => (ctx[param.name] = args[i]));
      this.body.run([...ctxs, ctx]);
      return ctx["result"];
    };
  }
}
