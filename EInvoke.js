import { EObject } from "./EObject.js";

export class EInvoke extends EObject {
  constructor(name, expressions) {
    super({ name, expressions });
  }
}
