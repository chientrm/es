import { EObject } from "./EObject.js";

export const eRun = (ctxs, o) => (o instanceof EObject ? o.run(ctxs) : o);
export const isObject = (a) => typeof a === "object" && a !== null;
