import React from 'react';
import { MvxFormatAmount } from '@multiversx/sdk-dapp-ui/dist/react/components';
import type { MvxFormatAmount as MvxFormatAmountPropsType } from '@multiversx/sdk-dapp-ui/dist/web-components/mvx-format-amount';
import { DECIMALS, DIGITS } from '@multiversx/sdk-dapp-utils/out/constants';
import { FormatAmountController } from '@multiversx/sdk-dapp/out/controllers';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/out/react/network/useGetNetworkConfig';
import { WithClassnameType } from 'types';

interface FormatAmountPropsType
  extends Partial<MvxFormatAmountPropsType>,
    WithClassnameType {
  token?: string;
  decimals?: number;
  digits?: number;
  egldLabel?: string;
  value: string;
  showLastNonZeroDecimal?: boolean;
}

export const FormatAmount = (props: FormatAmountPropsType) => {
  const { network } = useGetNetworkConfig();

  const { isValid, valueDecimal, valueInteger, label } =
    FormatAmountController.getData({
      digits: props.digits ?? DIGITS,
      decimals: props.decimals ?? DECIMALS,
      egldLabel: network.egldLabel,
      token: props.token,
      showLastNonZeroDecimal: props.showLastNonZeroDecimal,
      ...props,
      input: props.value
    });

  return (
    <MvxFormatAmount
      class={props.className}
      dataTestId={props.dataTestId}
      isValid={isValid}
      label={label}
      valueDecimal={valueDecimal}
      valueInteger={valueInteger}
    />
  );
};
