import { getPercentageOfAmount } from './../getPercentageOfAmount';

describe('getPercentageOfAmount tests', () => {
  test('getPercentageOfAmount works with invalid values (NaN)', () => {
    const amount = NaN;
    const balanceMinusDust = 1000_000_000_000_000;
    const percentage = getPercentageOfAmount(
      amount as any,
      balanceMinusDust as any
    );
    expect(percentage).toBe(0);
  });

  test('getPercentageOfAmount works with valid values', () => {
    const amount = '5000';
    const balanceMinusDust = '10000';
    const percentage = getPercentageOfAmount(amount, balanceMinusDust);
    expect(percentage).toBe(50);
  });

  test('getPercentageOfAmount works with invalid values (string)', () => {
    const amount = 'abc';
    const balanceMinusDust = '10000';
    const percentage = getPercentageOfAmount(amount, balanceMinusDust);
    expect(percentage).toBe(0);
  });

  test('getPercentageOfAmount works with values above total balance', () => {
    const amount = '1241123';
    const balanceMinusDust = '3311';
    const percentage = getPercentageOfAmount(amount, balanceMinusDust);

    expect(percentage).toBe(100);
  });

  test('getPercentageOfAmount works with zero value', () => {
    const amount = '0';
    const balanceMinusDust = '1124';
    const percentage = getPercentageOfAmount(amount, balanceMinusDust);

    expect(percentage).toBe(0);
  });

  test('getPercentageOfAmount calculates accurately', () => {
    const amount = '8342.2359';
    const balanceMinusDust = '12582.21580';
    const percentage = getPercentageOfAmount(amount, balanceMinusDust);

    expect(percentage).toBe(66.30180273970504);
  });
});
