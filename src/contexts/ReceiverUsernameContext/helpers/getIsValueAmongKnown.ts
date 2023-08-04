import { KnowAddressType } from 'contexts';

export interface GetIsValueAmongKnownType {
  knownAddresses: KnowAddressType[] | null;
  inputValue: string;
  key: keyof KnowAddressType;
}

export const getIsValueAmongKnown = ({
  knownAddresses,
  inputValue,
  key
}: GetIsValueAmongKnownType) => {
  if (!knownAddresses || !inputValue) {
    return false;
  }

  const valueIsAmongKnown = knownAddresses.some((account) =>
    Boolean(account[key]?.startsWith(inputValue))
  );

  return valueIsAmongKnown;
};
