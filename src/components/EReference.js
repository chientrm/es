import { EObject } from "./EObject.js";
import { search } from "../core/index.js";

export class EReference extends EObject {
  constructor(name) {
    super({ name });
  }
  run(contexts) {
    return typeof this.name === "string"
      ? search(contexts, this.name)
      : this.name.obj[this.name.name];
  }
}
