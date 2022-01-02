import { eEval } from "./src/escript.js";

export const eLib = {};
export { eEval };

typeof window !== "undefined" &&
  window.addEventListener("load", () =>
    document
      .querySelectorAll("script[type='application/es']")
      .forEach((script) =>
        script.src
          ? fetch(script.src)
              .then((res) => res.text())
              .then((text) => eEval([eLib], script.src, text))
          : eEval([eLib], window.location.href, script.innerHTML)
      )
  );
