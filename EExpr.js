import { EObject } from "./EObject.js";

export class EExpr extends EObject {
  constructor(operands, operators) {
    super({ operands, operators });
  }
}
