import { EObject } from "./EObject.js";

export class EIndexing extends EObject {
  constructor(name, expressions) {
    super({ name, expressions });
  }
}
