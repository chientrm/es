import { expect } from "chai";
import { describe, it } from "mocha";
import { EInvoke } from "./EInvoke.js";

describe("EInvoke", () => {
  describe("run", () => {
    const run = (contexts, name, operands) =>
      new EInvoke(name, operands).run(contexts);
    it("invalid", () => {
      expect(() => run([{}], "a", [])).to.throw("Unknown function a");
    });
    it("no arguments", () => {
      expect(run([{ a: () => 1 }], "a", [])).to.equal(1);
    });
    it("1 arguments", () => {
      expect(run([{ a: (i) => i + 1 }], "a", [1])).to.equal(2);
    });
    it("2 arguments", () => {
      expect(run([{ a: (i, j) => i * j }], "a", [2, 3])).to.equal(6);
    });
  });
  describe("assign", () => {
    const assign = (contexts, name, operands, value) =>
      new EInvoke(name, operands).assign(contexts, value);
    it("invalid", () => {
      expect(() => assign([{}], "a", [], 0)).to.throw(
        "Unknown lvalue invoke a"
      );
    });
  });
});
