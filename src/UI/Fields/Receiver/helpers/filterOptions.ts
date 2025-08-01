import type { FilterOptionOption } from 'react-select/dist/declarations/src/filters';
import type { GenericOptionType } from '../Receiver.types';

export const filterOptions = (
  option: FilterOptionOption<GenericOptionType>,
  search: string
) => {
  const receiverUserInput = search.toLowerCase();
  const label = option.label.toLowerCase();
  const value = option.value.toLowerCase();

  if (!search) {
    return true;
  }

  return label.includes(receiverUserInput) || value.includes(receiverUserInput);
};
