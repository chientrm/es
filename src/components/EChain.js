import { invalidChain } from "../core/error.js";
import { EName } from "./EName.js";
import { EReference } from "./EReference.js";
import { eRun } from "./utils.js";

export class EChain extends EName {
  constructor(names) {
    super({ names });
  }
  getNameKey(i) {
    const name = this.names[i];
    name instanceof EName || invalidChain(name);
    return [name, name.name];
  }
  run(contexts) {
    let result = eRun(contexts, this.names[0]);
    if (this.names.length > 1)
      for (let i = 1; i < this.names.length; i++) {
        const [name, key] = this.getNameKey(i);
        result = name.run([...contexts, { [key]: result[key] }], result);
      }
    return result;
  }
  assign(contexts, value) {
    if (this.names.length > 1) {
      let result = eRun(contexts, this.names[0]);
      for (let i = 1; i < this.names.length - 1; i++) {
        const [name, key] = this.getNameKey(i);
        result = name.run([...contexts, { [key]: result[key] }], result);
      }
      const [name, key] = this.getNameKey(this.names.length - 1);
      return name instanceof EReference
        ? (result[key] = value)
        : name.assign([...contexts, { [key]: result[key] }], value);
    } else return this.names[0].assign(contexts, value);
  }
}
