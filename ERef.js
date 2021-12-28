import { EObject } from "./EObject.js";
import { e_search } from "./e_search.js";

export class ERef extends EObject {
  constructor(name) {
    super({ name });
  }
  run(contexts) {
    return typeof this.name === "string"
      ? e_search(contexts, this.name)
      : this.name.obj[this.name.name];
  }
}
