import { EObject } from "./EObject.js";
import { e_search } from "./e_search.js";

export class EIndexing extends EObject {
  constructor(name, operands) {
    super({ name, operands });
  }
  run(ctxs) {
    let result = e_search(ctxs, this.name);
    this.operands.forEach((operand) => {
      operand.run && (operand = operand.run(ctxs));
      result = result[operand];
    });
    return result;
  }
}
