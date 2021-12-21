import { ESource } from "./ESource.js";
import { e_parse_tuple_contents } from "./e_parser.js";
import { e_run } from "./e_utils.js";

export const lib = {};

export const e_eval = (contexts, filename, text) => {
  const source = new ESource(filename, text);
  return e_run(contexts, e_parse_tuple_contents(source));
};

typeof window !== "undefined" &&
  window.addEventListener("load", () =>
    document
      .querySelectorAll("script[type='application/es']")
      .forEach((script) =>
        script.src
          ? fetch(script.src)
              .then((res) => res.text())
              .then((text) => e_eval([lib], script.src, text))
          : e_eval([lib], window.location.href, script.innerHTML)
      )
  );
