const e_find_ctx = (contexts, name) => {
  for (let i = contexts.length - 1; i >= 0; i--)
    if (name in contexts[i]) return contexts[i];
  return contexts[contexts.length - 1];
};

export const e_search = (contexts, name) => e_find_ctx(contexts, name)[name];

export const e_assign = (contexts, name, value) =>
  (e_find_ctx(contexts, name)[name] = value);
