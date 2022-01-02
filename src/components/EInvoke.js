import { search } from "../core/index.js";
import { EObject } from "./EObject.js";
import { eRun } from "./utils.js";

export class EInvoke extends EObject {
  constructor(name, operands) {
    super({ name, operands });
  }
  run(ctxs) {
    const func = search(ctxs, this.name);
    return func(...this.operands.map((o) => eRun(ctxs, eRun(ctxs, o))));
  }
}
