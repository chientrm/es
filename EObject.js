export class EObject {
  constructor(obj) {
    Object.assign(this, obj);
  }
  invalid(name) {
    throw `Invalid name: ${name}`;
  }
  outOfRange(value) {
    throw `Out of range: ${value}`;
  }
  run(contexts) {
    throw "Not implemented";
  }
}
