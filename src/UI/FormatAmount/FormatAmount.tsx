import React from 'react';
import { DECIMALS, DIGITS } from '@multiversx/sdk-dapp-utils/out/constants';
import { FormatAmountController } from '@multiversx/sdk-dapp/out/controllers';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/out/react/network/useGetNetworkConfig';
import { WithClassnameType } from 'types';
import { MvxFormatAmount } from '@multiversx/sdk-dapp-ui/react';

interface MvxFormatAmountPropsType {
  'data-testid'?: string;
  class?: string;
}

interface FormatAmountPropsType
  extends Partial<MvxFormatAmountPropsType>,
    WithClassnameType {
  token?: string;
  decimals?: number;
  digits?: number;
  egldLabel?: string;
  value: string;
  showLastNonZeroDecimal?: boolean;
  showLabel?: boolean;
}

export const FormatAmount = (props: FormatAmountPropsType) => {
  const { network } = useGetNetworkConfig();

  const { valueDecimal, valueInteger, label, isValid } =
    FormatAmountController.getData({
      digits: props.digits ?? DIGITS,
      decimals: props.decimals ?? DECIMALS,
      egldLabel: props.egldLabel ?? network.egldLabel,
      token: props.token,
      showLastNonZeroDecimal: props.showLastNonZeroDecimal,
      input: props.value
    });

  return (
    <MvxFormatAmount
      {...props}
      isValid={isValid}
      dataTestId={props['data-testid']}
      valueDecimal={valueDecimal}
      valueInteger={valueInteger}
      label={label}
    />
  );
};
