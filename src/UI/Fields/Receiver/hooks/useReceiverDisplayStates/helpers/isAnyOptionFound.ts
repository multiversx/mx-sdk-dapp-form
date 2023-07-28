import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

import { KnowAddressType } from 'contexts';
import { filterOptions } from 'UI/Fields/Receiver/helpers';
import { GenericOptionType } from 'UI/Fields/Receiver/Receiver.types';

export interface IsAnyOptionFoundType {
  knownAddresses: KnowAddressType[] | null;
  inputValue: string;
}

export const isAnyOptionFound = ({
  knownAddresses,
  inputValue
}: IsAnyOptionFoundType) => {
  if (!knownAddresses || !inputValue) {
    return false;
  }

  const foundOptions = knownAddresses.filter((option) => {
    const label = option.username ?? option.address;
    const value = option.address;

    const optionToLookFor: FilterOptionOption<GenericOptionType> = {
      label,
      value,
      data: { label, value }
    };

    return filterOptions(optionToLookFor, inputValue);
  });

  return foundOptions.length > 0;
};
