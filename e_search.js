export const e_search = (contexts, name) => {
  for (let i = contexts.length - 1; i >= 0; i--)
    if (name in contexts[i]) return contexts[i][name];
  return undefined;
};

export const e_assign = (contexts, name, value) => {
  for (let i = contexts.length - 1; i >= 0; i--) {
    if (name in contexts[i]) {
      contexts[i][name] = value;
      return;
    }
  }
  contexts[contexts.length - 1][name] = value;
};
