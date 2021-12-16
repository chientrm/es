export class EObject {
  constructor(obj) {
    Object.assign(this, obj);
  }
  invalid(name) {
    throw new Error(`Invalid name: ${name}`);
  }
  outOfRange(value) {
    throw new Error(`Out of range: ${value}`);
  }
  run(contexts) {
    throw new Error("Not implemented");
  }
}
