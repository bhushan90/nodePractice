exports.getHost = (req) => `${req.protocol}://${req.get('host')}/`;

exports.composeUrl = (req, toAppend) => `${this.getHost(req)}${toAppend}`;

exports.omitParams = (original = {}, ...paramsToOmit) => {
  if (paramsToOmit && paramsToOmit.length > 0) {
    const keys = Object.keys(original);
    // const filtredObject = {};
    // keys.forEach((v) => {
    //   if (!paramsToOmit.includes(v)) {
    //     filtredObject[v] = original[v];
    //   }
    // });
    // return filtredObject;

    return keys.reduce((combine, current) => {
      if (!paramsToOmit.includes(current)) {
        combine = { ...combine, [current]: original[current] };
      }
      return combine;
    }, {});
  }
  return original;
};
