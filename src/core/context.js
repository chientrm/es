export const findContext = (contexts, name) => {
  for (let i = contexts.length - 1; i >= 0; i--)
    if (name in contexts[i]) return contexts[i];
  return contexts[contexts.length - 1];
};

export const search = (contexts, name) => findContext(contexts, name)[name];

export const assign = (contexts, name, value) =>
  (findContext(contexts, name)[name] = value);
