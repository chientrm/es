import { EObject } from "./EObject.js";

export class ESet extends EObject {
  constructor(operands) {
    super({ operands });
  }
  run(contexts) {
    const result = {};
    contexts = [...contexts, result];
    this.operands.forEach((operand) => operand.run(contexts));
    return result;
  }
}
