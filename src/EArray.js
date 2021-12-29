import { EObject } from "./EObject.js";
import { e_run } from "./e_utils.js";

export class EArray extends EObject {
  constructor(operands) {
    super({ operands });
  }
  run(contexts) {
    return this.operands.reduce((p, c) => [...p, e_run(contexts, c)], []);
  }
}
