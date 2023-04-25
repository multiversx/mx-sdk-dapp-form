import type {
  ActionMeta,
  GroupBase,
  MenuPlacement,
  SingleValue
} from 'react-select';
import type { SelectComponents } from 'react-select/dist/declarations/src/components';

export interface GenericOptionType {
  label: string;
  value: string;
  data?: unknown;
}

export interface SelectPropsType {
  identifier: string;
  showAdditionalValue?: boolean;
  searchPattern?: 'includes' | 'startsWith';
  options: GenericOptionType[];
  menuPlacement?: MenuPlacement;
  menuIsOpen?: boolean;
  isInvalid?: boolean;
  onChange?: (
    newValue: SingleValue<GenericOptionType>,
    actionMeta: ActionMeta<GenericOptionType>
  ) => void;
  components?: Partial<
    SelectComponents<GenericOptionType, false, GroupBase<GenericOptionType>>
  >;
}
