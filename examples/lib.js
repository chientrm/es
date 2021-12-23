es.lib["log"] = console.log;
es.lib["format"] = (...args) => {
  let result = args[0];
  for (let i = 1; i < args.length; i++) {
    result = result.replace("{" + i + "}", args[i]);
  }
  return result;
};
es.lib["alert"] = alert;
es.lib["🔢"] = (caption) => window.prompt(caption) * 1;
es.lib["while"] = (cond, run) => {
  while (cond()) run();
};
es.lib["for"] = (start, end, func) => {
  for (let i = start; i < end; i++) func();
};
es.lib["random"] = () => Math.floor(Math.random() * 10);
