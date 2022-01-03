import { assign, search } from "../core/context.js";
import { EName } from "./EName.js";
import { eRun } from "./utils.js";

export class EIndexing extends EName {
  constructor(name, operands) {
    super({ name, operands });
  }
  run(contexts) {
    let res = search(contexts, this.name);
    this.operands.forEach((operand) => (res = res[eRun(contexts, operand)]));
    return res;
  }
  assign(contexts, value) {
    let result = undefined;
    if (this.operands.length) {
      let object = search(contexts, this.name);
      for (let i = 0; i < this.operands.length; i++) {
        const index = eRun(contexts, this.operands[i]);
        if (i === this.operands.length - 1) {
          object[index] = value;
          result = object[index];
        } else object = object[index];
      }
    } else result = assign(contexts, this.name, value);
    return result;
  }
}
