import { EObject } from "./EObject.js";

export class EString extends EObject {
  constructor(value) {
    super({ value });
  }
}
