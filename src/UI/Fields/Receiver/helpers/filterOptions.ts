import type { FilterOptionOption } from 'react-select/dist/declarations/src/filters';
import type { GenericOptionType } from '../Receiver.types';

export const filterOptions = (
  option: FilterOptionOption<GenericOptionType>,
  search: string
) => {
  const needle = search.toLowerCase();
  const label = option.label.toLowerCase();
  const value = option.value.toLowerCase();

  if (!search) {
    return true;
  }

  return label.includes(needle) || value.includes(needle);
};
