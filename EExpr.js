import { EObject } from "./EObject.js";
import { e_impl } from "./e_error.js";

export const funcs = {
  "*": { i: 0, value: e_impl },
  "/": { i: 0, value: e_impl },
  "%": { i: 0, value: e_impl },
  "+": { i: 1, value: e_impl },
  "-": { i: 1, value: e_impl },
  "<<": { i: 2, value: e_impl },
  ">>": { i: 2, value: e_impl },
  ">>>": { i: 2, value: e_impl },
  "<": { i: 3, value: e_impl },
  "<=": { i: 3, value: e_impl },
  ">": { i: 3, value: e_impl },
  ">=": { i: 3, value: e_impl },
  in: { i: 3, value: e_impl },
  instanceof: { i: 3, value: e_impl },
  "==": { i: 4, value: e_impl },
  "!=": { i: 4, value: e_impl },
  "===": { i: 4, value: e_impl },
  "!==": { i: 4, value: e_impl },
  "&": { i: 5, value: e_impl },
  "^": { i: 6, value: e_impl },
  "|": { i: 7, value: e_impl },
  "&&": { i: 8, value: e_impl },
  "||": { i: 9, value: e_impl },
  "=": { i: 10, value: e_impl },
  "+=": { i: 10, value: e_impl },
  "-=": { i: 10, value: e_impl },
  "*=": { i: 10, value: e_impl },
  "/=": { i: 10, value: e_impl },
  "%=": { i: 10, value: e_impl },
  "<<=": { i: 10, value: e_impl },
  ">>=": { i: 10, value: e_impl },
  ">>>=": { i: 10, value: e_impl },
  "&=": { i: 10, value: e_impl },
  "^=": { i: 10, value: e_impl },
  "|=": { i: 10, value: e_impl },
  "&&=": { i: 10, value: e_impl },
  "||=": { i: 10, value: e_impl },
  "??=": { i: 10, value: e_impl },
};

class Node extends EObject {
  constructor(left, right, func) {
    super({ left, right, func });
  }
  fix() {
    let result = null;
    while (this.left instanceof Node && this.left.func.i > this.func.i) {
      const tmp = this.left;
      this.left = this.left.right;
      tmp.right = this;
      result || (result = tmp);
    }
    result || (result = this);
    return result;
  }
  post(p) {
    this.left instanceof Node ? this.left.post(p) : p.push(this.left);
    this.right instanceof Node ? this.right.post(p) : p.push(this.right);
    p.push(this.func);
  }
}

export class EExpr extends EObject {
  constructor(operands, operators) {
    let node = operands[0];
    operators.forEach((operator, i) => {
      node = new Node(node, operands[i + 1], funcs[operator]);
      node = node.fix();
    });
    const postfix = [];
    node.post(postfix);
    super({ postfix });
  }
  run(contexts) {}
}
