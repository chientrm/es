import { EObject } from "./EObject.js";

export class ESet extends EObject {
  constructor(operands) {
    super({ operands });
  }
  run(contexts) {
    contexts = [...contexts, { result: null }];
    this.operands.forEach((operand) => {
      operand.run(contexts);
    });
    return contexts.at(-1)["result"];
  }
}
