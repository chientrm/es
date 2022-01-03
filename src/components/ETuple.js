import { EObject } from "./EObject.js";

export class ETuple extends EObject {
  constructor(operands) {
    super({ operands });
  }
  run(contexts) {
    let result = undefined;
    this.operands.forEach((operand) => (result = operand.run(contexts)));
    return result;
  }
}
