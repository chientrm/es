import { eRun } from "./components/utils.js";
import { parseTupleContent, Source } from "./lexical/index.js";

export const eEval = (contexts, filename, text) => {
  const source = new Source(filename, text);
  return eRun(contexts, parseTupleContent(source));
};
