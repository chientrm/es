import { notImplemented } from "../core/index.js";

export class EObject {
  constructor(object) {
    Object.assign(this, object);
  }
  run() {
    notImplemented("EObject.run");
  }
}
