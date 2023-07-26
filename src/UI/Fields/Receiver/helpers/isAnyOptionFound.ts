import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

import { KnowAddressType } from 'contexts';

import { GenericOptionType } from '../Receiver.types';
import { filterOptions } from './filterOptions';

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
