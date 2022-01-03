import { EObject } from "./EObject.js";

export const eRun = (ctxs, o) => (o instanceof EObject ? o.run(ctxs) : o);

/**
 * Original: {@link https://stackoverflow.com/a/8511350/15530167}
 * @param {*} a
 * @return {boolean} true if a is an object
 */
export const isObject = (a) =>
  typeof a === "object" && !Array.isArray(a) && a !== null;

/**
 * Original: {@link https://stackoverflow.com/a/7356528/15530167}.
 * @param {object} func
 * @return {boolean} true if func is a function
 */
export const isFunction = (func) =>
  func && {}.toString.call(func) === "[object Function]";
