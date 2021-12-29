import { e_eval } from "./src/es.js";

export const e_lib = {};
export { e_eval };

typeof window !== "undefined" &&
  window.addEventListener("load", () =>
    document
      .querySelectorAll("script[type='application/es']")
      .forEach((script) =>
        script.src
          ? fetch(script.src)
              .then((res) => res.text())
              .then((text) => e_eval([e_lib], script.src, text))
          : e_eval([e_lib], window.location.href, script.innerHTML)
      )
  );
