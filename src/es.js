import { ESource } from "./ESource.js";
import { e_parse_tuple_contents } from "./e_parser.js";
import { e_run } from "./e_utils.js";

export const e_eval = (contexts, filename, text) => {
  const source = new ESource(filename, text);
  return e_run(contexts, e_parse_tuple_contents(source));
};
