import { MAINNET_CHAIN_ID } from '@multiversx/sdk-dapp/out/constants';
import { getEntireBalance, getEntireTokenBalance } from '../getEntireBalance';

describe('Entire balance', () => {
  test('Entire balance default values', () => {
    const { entireBalance: available, entireBalanceMinusDust } =
      getEntireBalance({
        balance: '1000050000000000000', // 1
        gasPrice: '1000000000',
        gasLimit: '50000',
        decimals: 18,
        digits: 4,
        chainId: MAINNET_CHAIN_ID
      });
    expect(available).toBe('1');
    expect(entireBalanceMinusDust).toBe('0.9950');
  });

  test('Balance smaller than fee', () => {
    const { entireBalance: available, entireBalanceMinusDust } =
      getEntireBalance({
        balance: '1000050000000',
        gasPrice: '1000000000',
        gasLimit: '50000',
        decimals: 18,
        digits: 4,
        chainId: MAINNET_CHAIN_ID
      });
    expect(available).toBe('0');
    expect(entireBalanceMinusDust).toBe('0');
  });

  test('decimals lower than digits', () => {
    const tokenAmount = getEntireTokenBalance({
      decimals: 2,
      digits: 4,
      balance: '100'
    });
    expect(tokenAmount).toBe('1');
  });

  test('decimals higher than digits', () => {
    const tokenAmount = getEntireTokenBalance({
      decimals: 18,
      digits: 4,
      balance: '123456789123456789'
    });
    expect(tokenAmount).toBe('0.123456789123456789');
  });
});
