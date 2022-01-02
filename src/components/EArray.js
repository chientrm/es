import { EObject } from "./EObject.js";
import { eRun } from "./utils.js";

export class EArray extends EObject {
  constructor(operands) {
    super({ operands });
  }
  run(contexts) {
    return this.operands.reduce((p, c) => [...p, eRun(contexts, c)], []);
  }
}
