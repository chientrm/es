import { ENameList } from "./ENameList.js";
import { EObject } from "./EObject.js";

export class ESet extends EObject {
  constructor(operands) {
    super({ operands });
  }
  run(contexts) {
    const result = {};
    contexts = [...contexts, result];
    this.operands.forEach((operand) => {
      const _result = operand.run(contexts);
      _result instanceof ENameList && _result.run(contexts);
    });
    return result;
  }
}
