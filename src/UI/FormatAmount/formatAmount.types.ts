import { WithClassnameType } from 'types';

export interface FormatAmountPropsType extends WithClassnameType {
  value: string;
  showLastNonZeroDecimal?: boolean;
  showLabel?: boolean;
  token?: string;
  digits?: number;
  decimals?: number;
  egldLabel?: string;
  'data-testid'?: string;
  useMaxPrecision?: boolean;
}
