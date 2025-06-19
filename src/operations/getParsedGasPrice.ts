import { parseAmount } from '@multiversx/sdk-dapp-utils/out/helpers/parseAmount';

export function getParsedGasPrice(value: string) {
  if (isNaN(Number(value)) || value === '') {
    return parseAmount('0');
  }
  return parseAmount(value);
}
