import { EObject } from "./EObject.js";
import { e_search } from "./e_search.js";

export class ERef extends EObject {
  constructor(name) {
    super({ name });
  }
  run(contexts) {
    return e_search(contexts, this.name);
  }
}
