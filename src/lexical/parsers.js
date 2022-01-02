import {
  EArray,
  EExpression,
  EIndexing,
  EInvoke,
  EReference,
  ESet,
  ETuple,
} from "../components/index.js";
import { TOKENS } from "./char.js";
import { OPERANDS } from "./Source.js";

const parse = (src) => parsers[src.nextOperandType()](src);

const parseExpression = (src) => {
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
  return operators.length ? new EExpression(operands, operators) : operands[0];
};

const parseInvoke = (src) => {
  const name = src.popNextToken();
  const operands = [];
  src.matchToken("(");
  while (src.hasNextToken() && !src.nextTokenTypeIs(TOKENS.BRACKET_CLOSE))
    operands.push(parseExpression(src));
  src.matchToken(")");
  return new EInvoke(name, operands);
};

const parseArray = (src) => {
  const operands = [];
  src.matchToken("[");
  while (src.hasNextToken() && !src.nextTokenTypeIs(TOKENS.BRACKET_CLOSE))
    operands.push(parseExpression(src));
  src.matchToken("]");
  return new EArray(operands);
};

const parseTuple = (src) => {
  src.matchToken("(");
  const result = parseTupleContent(src);
  src.matchToken(")");
  return result;
};

const parseSet = (src) => {
  const operands = [];
  src.matchToken("{");
  while (src.hasNextToken() && !src.nextTokenTypeIs(TOKENS.BRACKET_CLOSE)) {
    const o = parseExpression(src);
    (o instanceof EExpression || o instanceof EInvoke) && operands.push(o);
  }
  src.matchToken("}");
  return new ESet(operands);
};

export const parseTupleContent = (src) => {
  const operands = [];
  while (src.hasNextToken() && !src.nextTokenTypeIs(TOKENS.BRACKET_CLOSE)) {
    const o = parseExpression(src);
    (o instanceof EExpression || o instanceof EInvoke) && operands.push(o);
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
  [OPERANDS.REF]: (src) => new EReference(src.popNextToken()),
  [OPERANDS.INVOKE]: parseInvoke,
  [OPERANDS.INDEXING]: (src) =>
    new EIndexing(src.popNextToken(), parseArray(src).operands),
  [OPERANDS.ARRAY]: parseArray,
  [OPERANDS.TUPLE]: parseTuple,
  [OPERANDS.SET]: parseSet,
};
