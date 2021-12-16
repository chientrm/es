import { EObject } from "./EObject.js";

const ops = [];

export class EExpr extends EObject {
  constructor(operands, operators) {
    super({ operands, operators });
  }
  run(contexts) {
    return null;
  }
}
