import { PartialTokenType, TokenAssetsType } from 'types';
import { JSXElementConstructor } from 'react';

export interface SelectOptionType {
  label: string;
  value: string;
}

export interface OptionType {
  value: string;
  label: string;
  assets?: TokenAssetsType;
  token: PartialTokenType & {
    usdPrice?: string;
    valueUSD?: string;
  };
}

export interface TokenSelectPropsType {
  id?: string;
  value?: OptionType;
  name: string;
  isLoading?: boolean;
  options: OptionType[];
  isSearchable?: boolean;
  className?: string;
  wrapperClassName?: string;
  onChange: (option: any) => void;
  onBlur?: (option: any) => void;
  onMenuOpen?: () => void;
  disabled?: boolean;
  error?: string;
  EgldIcon?: JSXElementConstructor<any>;
  egldLabel: string;
  chainId: string;
  isInvalid?: boolean;
  noOptionsMessage?: string;
  hasLockedMEX?: boolean;
  hasLockedTokens?: boolean;
  onFocus?: (props: any) => void;
  disabledOption?: SelectOptionType;
  handleDisabledOptionClick?: any;
  showTokenPrice?: boolean;
  showBalanceUsdValue?: boolean;
  selectedTokenIconClassName?: string;
  TokenTickerIcon?: ({ token }: { token?: PartialTokenType }) => JSX.Element;
}
