import { search, assign } from "../core/index.js";
import { EName } from "./EName.js";

export class EReference extends EName {
  constructor(name) {
    super({ name });
  }
  run(contexts) {
    return search(contexts, this.name);
  }
  assign(contexts, value) {
    return assign(contexts, this.name, value);
  }
}
