exports.getConfValue = (key) => {
  if (!key) return undefined;
  return process.env[key];
};
