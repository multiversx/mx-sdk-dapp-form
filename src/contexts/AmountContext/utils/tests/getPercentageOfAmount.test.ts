import { getPercentageOfAmount } from './../getPercentageOfAmount';

describe('getPercentageOfAmount tests', () => {
  test('getPercentageOfAmount works with invalid values', () => {
    const amount = NaN;
    const maxAmountMinusDust = 1000_000_000_000_000;
    const percentage = getPercentageOfAmount(
      amount as any,
      maxAmountMinusDust as any
    );
    expect(percentage).toBe(0);
  });

  test('getPercentageOfAmount works with valid values', () => {
    const amount = 5000;
    const maxAmountMinusDust = 10000;
    const percentage = getPercentageOfAmount(
      amount as any,
      maxAmountMinusDust as any
    );
    expect(percentage).toBe(50);
  });
});
