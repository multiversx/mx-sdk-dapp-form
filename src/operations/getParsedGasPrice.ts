import { parseAmount } from 'helpers/dapp-core';

export function getParsedGasPrice(value: string) {
  if (isNaN(Number(value)) || value === '') {
    return parseAmount('0');
  }
  return parseAmount(value);
}
