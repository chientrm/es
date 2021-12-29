import { EObject } from "./EObject.js";
import { e_search } from "./e_context.js";
import { e_run } from "./e_utils.js";

export class EInvoke extends EObject {
  constructor(name, operands) {
    super({ name, operands });
  }
  run(ctxs) {
    const func = e_search(ctxs, this.name);
    return func(...this.operands.map((o) => e_run(ctxs, e_run(ctxs, o))));
  }
}
