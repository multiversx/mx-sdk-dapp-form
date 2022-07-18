import { getInitialGasPrice } from './../getInitialGasPrice';

describe('getInitialGasPrice tests', () => {
  it('getInitialGasPrice returns zero', () => {
    const gasPrice = getInitialGasPrice('1');
    expect(gasPrice).toBe('1');
  });
});
