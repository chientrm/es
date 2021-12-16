import { EObject } from "./EObject.js";

export class ERef extends EObject {
  constructor(name) {
    super({ name });
  }
  run(contexts) {
    for (let i = contexts.length - 1; i >= 0; i--) {
      const value = contexts[i][this.name];
      if (value !== undefined) return value;
    }
    return undefined;
  }
}
