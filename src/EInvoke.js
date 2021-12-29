import { EObject } from "./EObject.js";
import { e_search } from "./e_context.js";
import { e_run } from "./e_utils.js";

export class EInvoke extends EObject {
  constructor(name, operands) {
    super({ name, operands });
  }
  run(contexts) {
    const func = e_search(contexts, this.name);
    return func(...this.operands.map((o) => e_run(contexts, o)));
  }
}
