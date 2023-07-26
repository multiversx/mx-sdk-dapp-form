import { GroupBase, SelectInstance } from 'react-select';

export interface GenericOptionType {
  label: string;
  value: string;
  data?: unknown;
}

export type ReceiverSelectReferenceType = SelectInstance<
  GenericOptionType,
  // Whether the select instance supports multiple options.
  false,
  GroupBase<GenericOptionType>
> | null;
