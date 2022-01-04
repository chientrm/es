import { EObject } from "./EObject.js";
import { operators as funcs } from "./operators.js";
import { invalidOperator } from "../core/index.js";
import { ENameList } from "./ENameList.js";

class Node extends EObject {
  constructor(left, right, func) {
    super({ left, right, func });
  }
  fix() {
    if (this.left instanceof Node && this.left.func.i > this.func.i) {
      const tmp = this.left;
      this.left = this.left.right;
      tmp.right = this.fix();
      return tmp;
    }
    return this;
  }
  post(p) {
    const _p1 = (o) =>
      o instanceof EExpression ? p.push(...o.postfix) : p.push(o);
    const _p2 = (o) => (o instanceof Node ? o.post(p) : _p1(o));
    _p2(this.left);
    _p2(this.right);
    p.push(this.func.f);
  }
}

export class EExpression extends EObject {
  constructor(operands, operators) {
    let node = operands[0];
    operators.forEach((operator, i) => {
      funcs[operator] || invalidOperator(operator);
      node = new Node(node, operands[i + 1], funcs[operator]);
      node = node.fix();
    });
    const postfix = [];
    node.post(postfix);
    super({ postfix });
  }
  run(ctxs) {
    const stack = [];
    this.postfix.forEach((p) =>
      typeof p === "function"
        ? stack.push(p(ctxs, stack.pop(), stack.pop()))
        : stack.push(p)
    );
    let result = stack.pop();
    result instanceof ENameList && (result = result.run(ctxs));
    return result;
  }
}
