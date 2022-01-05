import { invalidFunction, invalidLvalue } from "../core/error.js";
import { search } from "../core/index.js";
import { EName } from "./EName.js";
import { eRun, isFunction } from "./utils.js";

export class EInvoke extends EName {
  constructor(name, operands) {
    super({ name, operands });
  }
  run(ctxs, _this) {
    const func = search(ctxs, this.name);
    isFunction(func) || invalidFunction(this.name);
    return func.apply(
      _this,
      this.operands.map((o) => eRun(ctxs, eRun(ctxs, o)))
    );
  }
  assign() {
    invalidLvalue(`invoke ${this.name}`);
  }
}
