import { GroupBase, SelectInstance } from 'react-select';

export interface GenericOptionType {
  label: string;
  value: string;
  data?: unknown;
}

export type ReceiverSelectReferenceType = SelectInstance<
  GenericOptionType,
  false,
  GroupBase<GenericOptionType>
> | null;
