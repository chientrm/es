import { EArray } from "./EArray.js";
import { EExpr } from "./EExpr.js";
import { EIndexing } from "./EIndexing.js";
import { EInvoke } from "./EInvoke.js";
import { ERef } from "./ERef.js";
import { ESet } from "./ESet.js";
import { OPERANDS } from "./ESource.js";
import { ETuple } from "./ETuple.js";
import { TOKENS } from "./e_char.js";

const parse = (src) => parsers[src.nextOperandType()](src);

const parse_expression = (src) => {
  const operands = [];
  const operators = [];
  let flag = 0;
  const err = () => src.expected("operand");
  while (src.hasNextToken() && !src.nextTokenTypeIs(TOKENS.BRACKET_CLOSE)) {
    if (src.nextTokenTypeIs(TOKENS.OPERATOR)) {
      flag || err();
      operators.push(src.popNextToken());
    } else {
      if (flag) break;
      operands.push(parse(src));
    }
    flag = 1 - flag;
  }
  operands.length && !flag && err();
  return operators.length ? new EExpr(operands, operators) : operands[0];
};

const parse_invoke = (src) => {
  const name = src.popNextToken();
  const operands = [];
  src.matchToken("(");
  while (src.hasNextToken() && !src.nextTokenTypeIs(TOKENS.BRACKET_CLOSE))
    operands.push(parse_expression(src));
  src.matchToken(")");
  return new EInvoke(name, operands);
};

const parse_array = (src) => {
  const operands = [];
  src.matchToken("[");
  while (src.hasNextToken() && !src.nextTokenTypeIs(TOKENS.BRACKET_CLOSE))
    operands.push(parse_expression(src));
  src.matchToken("]");
  return new EArray(operands);
};

const parse_tuple = (src) => {
  src.matchToken("(");
  const result = e_parse_tuple_contents(src);
  src.matchToken(")");
  return result;
};

const parse_set = (src) => {
  const operands = [];
  src.matchToken("{");
  while (src.hasNextToken() && !src.nextTokenTypeIs(TOKENS.BRACKET_CLOSE)) {
    const o = parse_expression(src);
    (o instanceof EExpr || o instanceof EInvoke) && operands.push(o);
  }
  src.matchToken("}");
  return new ESet(operands);
};

export const e_parse_tuple_contents = (src) => {
  const operands = [];
  while (src.hasNextToken() && !src.nextTokenTypeIs(TOKENS.BRACKET_CLOSE)) {
    const o = parse_expression(src);
    (o instanceof EExpr || o instanceof EInvoke) && operands.push(o);
  }
  return operands.length ? new ETuple(operands) : undefined;
};

export const parsers = {
  [OPERANDS.BOOL]: (src) => (src.popNextToken() === "true" ? true : false),
  [OPERANDS.NULL]: (src) => {
    src.popNextToken();
    return null;
  },
  [OPERANDS.UNDEFINED]: (src) => {
    src.popNextToken();
    return undefined;
  },
  [OPERANDS.INF]: (src) => {
    src.popNextToken();
    return Infinity;
  },
  [OPERANDS.NUMBER]: (src) => src.popNextToken() * 1,
  [OPERANDS.STRING]: (src) => {
    const s = src.popNextToken();
    return s.substring(1, s.length - 1);
  },
  [OPERANDS.REF]: (src) => new ERef(src.popNextToken()),
  [OPERANDS.INVOKE]: parse_invoke,
  [OPERANDS.INDEXING]: (src) =>
    new EIndexing(src.popNextToken(), parse_array(src).operands),
  [OPERANDS.ARRAY]: parse_array,
  [OPERANDS.TUPLE]: parse_tuple,
  [OPERANDS.SET]: parse_set,
};
