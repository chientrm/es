import { ESource } from "./ESource.js";
import { e_parse_set_contents } from "./e_parser.js";

export const e_eval = (contexts, filename, text) => {
  const source = new ESource(filename, text);
  const set = e_parse_set_contents(source);
  return set.run(contexts);
};
