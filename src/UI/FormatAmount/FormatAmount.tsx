import React from 'react';
import classNames from 'classnames';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { MvxFormatAmount } from 'lib/sdkDappUi';
import { FormatAmountPropsType } from './formatAmount.types';
import { getFormatAmountParts } from './helpers';

export const FormatAmount = (props: FormatAmountPropsType) => {
  const { className, showLabel = true, token } = props;
  const { isValid, label, valueDecimal, valueInteger } =
    getFormatAmountParts(props);

  return (
    <MvxFormatAmount
      class={className}
      dataTestId={
        props['data-testid'] ?? FormDataTestIdsEnum.formatAmountComponent
      }
      isValid={isValid}
      label={label}
      labelClass={classNames({ 'text-muted': token })}
      showLabel={showLabel}
      valueDecimal={valueDecimal}
      valueInteger={valueInteger}
    />
  );
};
