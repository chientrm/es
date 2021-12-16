import { ESet } from "./ESet.js";
import { OPERANDS, ESource } from "./ESource.js";
import { ERef } from "./ERef.js";
import { TOKENS } from "./EChar.js";
import { ENumber } from "./ENumber.js";
import { EExpr } from "./EExpr.js";
import { EArray } from "./EArray.js";
import { EIndexing } from "./EIndexing.js";
import { EInvoke } from "./EInvoke.js";
import { EString } from "./EString.js";

const make_operands = {
  [OPERANDS.BOOL]: (source) => new EBoolean(source.popNextToken()),
  [OPERANDS.NULL]: (source) => new ENull(source.popNextToken()),
  [OPERANDS.UNDEFINED]: (source) => new EUndefined(source.popNextToken()),
  [OPERANDS.NUMBER]: (source) => new ENumber(source.popNextToken()),
  [OPERANDS.STRING]: (source) => new EString(source.popNextToken()),
  [OPERANDS.REF]: (source) => new ERef(source.popNextToken()),
  [OPERANDS.INVOKE]: (source) => e_parse_invoke(source),
  [OPERANDS.INDEXING]: (source) => e_parse_indexing(source),
  [OPERANDS.ARRAY]: (source) => e_parse_array(source),
  [OPERANDS.SUB]: (source) => e_parse_sub(source),
  [OPERANDS.SET]: (source) => e_parse_set(source),
  [OPERANDS.UNKNOWN]: () => null,
};

export const e_parse_invoke = (source) => {
  const expressions = [];
  const name = source.popNextToken();
  source.matchToken("(");
  while (source.hasNextToken()) {
    if (source.nextTokenIs(")")) break;
    const expression = e_parse_expression(source);
    !expression && source.expected("param");
    expressions.push(expression);
  }
  source.matchToken(")");
  return new EInvoke(name, expressions);
};

export const e_parse_indexing = (source) => {
  const expressions = [];
  const name = source.popNextToken();
  source.matchToken("[");
  while (source.hasNextToken()) {
    if (source.nextTokenIs("]")) break;
    const expression = e_parse_expression(source);
    !expression && source.expected("expression");
    expressions.push(expression);
  }
  source.matchToken("]");
  return new EIndexing(name, expressions);
};

export const e_parse_array = (source) => {
  const expressions = [];
  source.matchToken("[");
  while (source.hasNextToken()) {
    if (source.nextTokenIs("]")) break;
    const expression = e_parse_expression(source);
    !expression && source.expected("expression");
    expressions.push(expression);
  }
  source.matchToken("]");
  return new EArray(expressions);
};

export const e_parse_expression = (source) => {
  const operands = [],
    operators = [];
  while (source.hasNextToken()) {
    const operand = make_operands[source.nextOperandType()](source);
    if (!operand) break;
    operands.push(operand);
    if (!source.hasNextToken() || !source.nextTokenTypeIs(TOKENS.OPERATOR)) {
      break;
    }
    operators.push(source.popNextToken());
  }
  return operands.length ? new EExpr(operands, operators) : null;
};

export const e_parse_sub = (source) => {
  source.matchToken("(");
  const result = e_parse_expression(source);
  source.matchToken(")");
  return result;
};

export const e_parse_set_contents = (source) => {
  const expressions = [];
  while (source.hasNextToken()) {
    if (source.nextTokenIs("}")) break;
    const expression = e_parse_expression(source);
    !expression && source.expected("expression");
    expressions.push(expression);
  }
  return new ESet(expressions);
};

export const e_parse_set = (source) => {
  source.matchToken("{");
  const result = e_parse_set_contents(source);
  source.matchToken("}");
  return result;
};

export const e_eval = (contexts, filename, text) => {
  const source = new ESource(filename, text);
  const set = e_parse_set_contents(source);
  return null;
};
