import { ZERO } from '@multiversx/sdk-dapp/constants';

export const hasLeadingZeroes = (value: string) => {
  const [firstCharacter, secondCharacter] = value.split('');

  const firstChacterIsZero = firstCharacter === ZERO;
  const secondCharacterIsPeriod = secondCharacter === '.';

  if (firstChacterIsZero && secondCharacter && !secondCharacterIsPeriod) {
    return true;
  }

  return false;
};
