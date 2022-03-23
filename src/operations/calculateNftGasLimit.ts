export const calculateNftGasLimit = (data = '') =>
  String(Math.max(750_000 + data.length * 1_500, 1_000_000));
