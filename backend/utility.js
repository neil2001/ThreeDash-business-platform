const formatter = (a, ...args) => {
  for (let k = 0; k < args.length; k++) {
    a = a.replace(new RegExp("\\{" + k + "\\}", "g"), args[k]);
  }
  return a;
};

exports.formatter = formatter;
