import { EObject } from "./EObject.js";

export class ENumber extends EObject {
  constructor(value) {
    super({ value });
  }
}
