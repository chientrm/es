import { EObject } from "./EObject.js";

export const e_run = (ctxs, o) => (o instanceof EObject ? o.run(ctxs) : o);
