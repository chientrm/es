import { search } from "../core/context.js";
import { EObject } from "./EObject.js";
import { eRun } from "./utils.js";

export class EIndexing extends EObject {
  constructor(name, operands) {
    super({ name, operands });
  }
  run(ctxs) {
    let result = search(ctxs, this.name);
    this.operands.forEach((operand) => (result = result[eRun(ctxs, operand)]));
    return result;
  }
}
