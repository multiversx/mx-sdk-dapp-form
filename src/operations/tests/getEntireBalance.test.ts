import { mainnetChainId } from '@elrondnetwork/dapp-core/constants';
import { getEntireBalance } from '../getEntireBalance';

describe('Entire balance', () => {
  test('Entire balance default values', () => {
    const {
      entireBalance: available,
      entireBalanceMinusDust
    } = getEntireBalance({
      balance: '1000050000000000000', // 1
      gasPrice: '1000000000',
      gasLimit: '50000',
      denomination: 18,
      decimals: 4,
      chainId: mainnetChainId
    });
    expect(available).toBe('1');
    expect(entireBalanceMinusDust).toBe('0.9950');
  });

  test('Balance smaller than fee', () => {
    const {
      entireBalance: available,
      entireBalanceMinusDust
    } = getEntireBalance({
      balance: '1000050000000',
      gasPrice: '1000000000',
      gasLimit: '50000',
      denomination: 18,
      decimals: 4,
      chainId: mainnetChainId
    });
    expect(available).toBe('0');
    expect(entireBalanceMinusDust).toBe('0');
  });
});
