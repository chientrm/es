import { EObject } from "./EObject.js";

export class ESet extends EObject {
  constructor(expressions) {
    super({ expressions });
  }
}
