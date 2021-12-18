import { EObject } from "./EObject.js";
import { e_search } from "./e_search.js";

export class EIndexing extends EObject {
  constructor(name, operands) {
    super({ name, operands });
  }
  run(contexts) {
    let a = e_search(contexts, this.name);
    a || this.invalid(this.name);
    !a && this.invalid(this.name);
    const values = this.operands.map((o) => (o.run ? o.run(contexts) : o));
    values.forEach((v) => {
      a = a[v];
      a || this.outOfRange(v);
    });
    return a;
  }
}
