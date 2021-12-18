export const e_error = (mes) => {
  throw new Error(mes);
};

export const e_syntax = (filename, lineNo, what) => {
  throw new SyntaxError(`${filename}:${lineNo}\n${what} is expected`);
};

export const e_opter = (opter) => {
  throw new Error(`Unknown operator ${opter}`);
};

export const e_impl = () => e_error("Not implemented");
