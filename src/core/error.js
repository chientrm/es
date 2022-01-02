export const syntaxExpected = (filename, lineNo, what) => {
  throw new SyntaxError(`${filename}:${lineNo}\n${what} is expected`);
};

export const invalidName = (name) => {
  throw new Error(`Unknown name ${name}`);
};

export const invalidParam = (param) => {
  throw new Error(`Unknown param ${param}`);
};

export const invalidLvalue = (lvalue) => {
  throw new Error(`Unknown lvalue ${lvalue}`);
};

export const invalidOperator = (operator) => {
  throw new Error(`Unknown operator ${operator}`);
};

export const notImplemented = (what) => {
  throw new Error(`${what} is not implemented`);
};
