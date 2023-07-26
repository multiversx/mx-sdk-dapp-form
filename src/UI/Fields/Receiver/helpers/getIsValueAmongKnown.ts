import { KnowAddressType } from 'contexts';

export interface GetIsValueAmongKnownType {
  knownAddresses: KnowAddressType[] | null;
  inputValue: string;
  key: string;
}

export const getIsValueAmongKnown = ({
  knownAddresses,
  inputValue,
  key
}: GetIsValueAmongKnownType) => {
  if (!knownAddresses || !inputValue) {
    return false;
  }

  const valueIsAmongKnown = knownAddresses.find((account) =>
    account[key] ? account[key].startsWith(inputValue) : false
  );

  return Boolean(valueIsAmongKnown);
};
