import { EName } from "./EName.js";
import { EReference } from "./EReference.js";

export class ENameList extends EName {
  constructor(names) {
    super({ names });
  }
  run(contexts) {
    if (this.names.length === 1) return this.names[0].run(contexts);
    let result = this.names[0].run(contexts);
    for (let i = 1; i < this.names.length; i++) {
      const key = this.names[i].name;
      result = this.names[i].run([...contexts, { [key]: result[key] }]);
    }
    return result;
  }
  assign(contexts, value) {
    if (this.names.length === 1) return this.names[0].assign(contexts, value);
    let object = this.names[0].run(contexts);
    for (let i = 1; i < this.names.length; i++) {
      const key = this.names[i].name;
      const newContexts = [...contexts, { [key]: object[key] }];
      if (i === this.names.length - 1)
        object =
          this.names[i] instanceof EReference
            ? (object[key] = value)
            : this.names[i].assign(newContexts, value);
      else object = this.names[i].run(newContexts);
    }
    return object;
  }
}
