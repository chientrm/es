import { EExpr } from "./EExpr.js";
import { EIndexing } from "./EIndexing.js";
import { EInvoke } from "./EInvoke.js";
import { ERef } from "./ERef.js";
import { ESet } from "./ESet.js";
import { OPERANDS } from "./ESource.js";
import { TOKENS } from "./e_char.js";

const parse_expression = (source) => {
  const operands = [];
  const operators = [];
  while (source.hasNextToken()) {
    if (source.nextTokenTypeIs(TOKENS.OPERATOR)) {
      const err = () => source.expected("operand");
      operands.length || err();
      operators.push(source.popNextToken());
      source.hasNextToken() || err();
      const o = parsers[source.nextOperandType()](source);
      o || err();
      operands.push(o);
    } else {
      if (operands.length > operators.length) break;
      const o = parsers[source.nextOperandType()](source);
      if (!o) break;
      operands.push(o);
    }
  }
  let r = null;
  operands.length && operators.length && (r = new EExpr(operands, operators));
  operands.length && !operators.length && (r = operands[0]);
  return r;
};

const parse_invoke = (source) => {
  const operands = [];
  const name = source.popNextToken();
  source.matchToken("(");
  while (source.hasNextToken()) {
    if (source.nextTokenIs(")")) break;
    const o = parse_expression(source);
    o || source.expected("param or )");
    operands.push(o);
  }
  source.matchToken(")");
  return new EInvoke(name, operands);
};

const parse_indexing = (source) => {
  const operands = [];
  const name = source.popNextToken();
  source.matchToken("[");
  while (source.hasNextToken()) {
    if (source.nextTokenIs("]")) break;
    const o = parse_expression(source);
    o || source.expected("index or ]");
    operands.push(o);
  }
  source.matchToken("]");
  return new EIndexing(name, operands);
};

const parse_array = (source) => {
  const operands = [];
  source.matchToken("[");
  while (source.hasNextToken()) {
    if (source.nextTokenIs("]")) break;
    const o = parse_expression(source);
    o || source.expected("value or ]");
    operands.push(o);
  }
  source.matchToken("]");
  return operands;
};

const parse_sub = (source) => {
  source.matchToken("(");
  const result = parse_expression(source);
  source.matchToken(")");
  return result;
};

const parse_set = (source) => {
  source.matchToken("{");
  const result = e_parse_set_contents(source);
  source.matchToken("}");
  return result;
};

export const e_parse_set_contents = (source) => {
  const operands = [];
  while (source.hasNextToken()) {
    if (source.nextTokenIs("}")) break;
    const o = parse_expression(source);
    o || source.expected("set contents");
    o instanceof ERef || operands.push(o);
  }
  return new ESet(operands);
};

export const parsers = {
  [OPERANDS.BOOL]: (source) =>
    source.popNextToken() === "true" ? true : false,
  [OPERANDS.NULL]: (source) => {
    source.popNextToken();
    return null;
  },
  [OPERANDS.UNDEFINED]: (source) => {
    source.popNextToken();
    return undefined;
  },
  [OPERANDS.NUMBER]: (source) => source.popNextToken() * 1,
  [OPERANDS.STRING]: (source) => {
    const s = source.popNextToken();
    return s.substring(1, s.length - 1);
  },
  [OPERANDS.REF]: (source) => new ERef(source.popNextToken()),
  [OPERANDS.INVOKE]: parse_invoke,
  [OPERANDS.INDEXING]: parse_indexing,
  [OPERANDS.ARRAY]: parse_array,
  [OPERANDS.SUB]: parse_sub,
  [OPERANDS.SET]: parse_set,
  [OPERANDS.UNKNOWN]: (source) => source.expected("expression"),
};
