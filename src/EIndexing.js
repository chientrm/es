import { EObject } from "./EObject.js";
import { e_search } from "./e_context.js";
import { e_run } from "./e_utils.js";

export class EIndexing extends EObject {
  constructor(name, operands) {
    super({ name, operands });
  }
  run(ctxs) {
    let result = e_search(ctxs, this.name);
    this.operands.forEach((operand) => (result = result[e_run(ctxs, operand)]));
    return result;
  }
}
