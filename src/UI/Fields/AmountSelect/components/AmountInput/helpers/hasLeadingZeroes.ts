import BigNumber from 'bignumber.js';

export const hasLeadingZeroes = (value: string) => {
  const [firstCharacter, secondCharacter] = value.split('');

  const firstChacterIsZero = new BigNumber(firstCharacter).isZero();
  const secondCharacterIsPeriod = secondCharacter === '.';

  if (firstChacterIsZero && secondCharacter && !secondCharacterIsPeriod) {
    return true;
  }

  return false;
};
