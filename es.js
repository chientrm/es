import { EObject } from "./EObject.js";
import { ESource } from "./ESource.js";
import { e_parse_tuple_contents } from "./e_parser.js";

export const lib = {};

export const e_eval = (contexts, filename, text) => {
  const source = new ESource(filename, text);
  const tuple = e_parse_tuple_contents(source);
  return tuple instanceof EObject ? tuple.run(contexts) : tuple;
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
