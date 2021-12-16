export const e_search = (contexts, name) => {
  for (let i = contexts.length - 1; i >= 0; i--) {
    const value = contexts[i][name];
    if (value !== undefined) return value;
  }
  return undefined;
};
