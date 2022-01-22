import Decimal from "../lib/decimal.min.js";

/**
 * @param {Decimal} value 
 * @param {Decimal} max 
 * @returns {number}
 */
function calcProgress(value, max) {
  if (!(value instanceof Decimal)) value = Decimal(value);
  if (!(max instanceof Decimal)) max = Decimal(max);

  let progress = 0;

  if (max.gt(1e15)) {
    progress = value.log().div(max.log());
  } else {
    progress = value.div(max);
  }

  return Math.max(0, Math.min(1, progress.toNumber()));
}

export default calcProgress;
