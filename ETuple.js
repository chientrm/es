import { EObject } from "./EObject.js";

export class ETuple extends EObject {
  constructor(operands) {
    super({ operands });
  }
  run(ctxs) {
    let result = undefined;
    this.operands.forEach((operand) => (result = operand.run(ctxs)));
    return result;
  }
}
