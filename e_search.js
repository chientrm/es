const e_find_ctx = (contexts, name) => {
  for (let i = contexts.length - 1; i >= 0; i--)
    if (name in contexts[i]) return contexts[i];
  return contexts[contexts.length - 1];
};

export const e_search = (contexts, name) => {
  const names = name.split(".");
  return names.reduce(
    (p, c) => (p === Object(p) && c in p ? p[c] : undefined),
    e_find_ctx(contexts, names[0])
  );
};

export const e_assign = (contexts, name, value) => {
  const names = name.split(".");
  const ctx = e_find_ctx(contexts, names[0]);
  if (names.length > 1) {
    const last_name = names.splice(-1)[0];
    const obj = names.reduce(
      (p, c) => (p === Object(p) && c in p ? p[c] : undefined),
      e_find_ctx(contexts, names[0])
    );
    obj === Object(obj) && (obj[last_name] = value);
  } else ctx[name] = value;
};
