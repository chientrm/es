import { EObject } from "./EObject.js";

export class EArray extends EObject {
  constructor(expressions) {
    super({ expressions });
  }
}
