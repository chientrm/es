import { EObject } from "./EObject.js";
import { e_search } from "./e_search.js";

export class EInvoke extends EObject {
  constructor(name, operands) {
    super({ name, operands });
  }
  run(contexts) {
    const func = e_search(contexts, this.name);
    const values = this.operands.map((o) => (o.run ? o.run(contexts) : o));
    return func(...values);
  }
}
