import React from 'react';
import classNames from 'classnames';
import {
  DIGITS,
  DECIMALS,
  ZERO
} from '@multiversx/sdk-dapp-utils/out/constants';
import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { stringIsInteger } from '@multiversx/sdk-dapp-utils/out/helpers/stringIsInteger';
import { getEgldLabel } from '@multiversx/sdk-dapp/out/methods/network/getEgldLabel';
import { FormatAmountPropsType } from './formatAmount.types';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';

const formatAmountInvalid = (props: FormatAmountPropsType) => {
  return (
    <span
      data-testid={
        props['data-testid'] || FormDataTestIdsEnum.formatAmountComponent
      }
      className={props.className}
    >
      <span
        className='int-amount'
        data-testid={FormDataTestIdsEnum.formatAmountInt}
      >
        ...
      </span>
    </span>
  );
};

const formatAmountValid = (props: FormatAmountPropsType, erdLabel: string) => {
  const { value, showLastNonZeroDecimal = false, showLabel = true } = props;
  const digits = props.digits != null ? props.digits : DIGITS;
  const decimals = props.decimals != null ? props.decimals : DECIMALS;

  // When showLastNonZeroDecimal is true, increase digits limit
  // to allow the formatAmount function to see all decimal places
  const effectiveDigits = showLastNonZeroDecimal
    ? Math.max(digits, 18)
    : digits;

  let formattedValue = formatAmount({
    input: value,
    decimals,
    digits: effectiveDigits,
    showLastNonZeroDecimal,
    addCommas: true
  });

  // Clean up trailing zeros when showLastNonZeroDecimal is true
  if (showLastNonZeroDecimal) {
    const parts = formattedValue.split('.');
    if (parts.length > 1) {
      // Remove trailing zeros from decimal part
      parts[1] = parts[1].replace(/0+$/, '');
      // If decimal part is empty after removing zeros, remove the decimal point
      if (parts[1] === '') {
        formattedValue = parts[0];
      } else {
        formattedValue = parts.join('.');
      }
    }
  }

  const valueParts = formattedValue.split('.');
  const hasNoDecimals = valueParts.length === 1;
  const isNotZero = formattedValue !== ZERO;

  // Only add trailing zeros when showLastNonZeroDecimal is FALSE
  // This preserves the original behavior for fixed-width formatting
  if (digits > 0 && hasNoDecimals && isNotZero && !showLastNonZeroDecimal) {
    let zeros = '';

    for (let i = 1; i <= digits; i++) {
      zeros = zeros + ZERO;
    }

    valueParts.push(zeros);
  }

  return (
    <span
      data-testid={
        props['data-testid'] || FormDataTestIdsEnum.formatAmountComponent
      }
      className={props.className}
    >
      <span
        className={'int-amount'}
        data-testid={FormDataTestIdsEnum.formatAmountInt}
      >
        {valueParts[0]}
      </span>
      {valueParts.length > 1 && (
        <span
          className={'decimals'}
          data-testid={FormDataTestIdsEnum.formatAmountDecimals}
        >
          .{valueParts[1]}
        </span>
      )}
      {showLabel && (
        <span
          className={classNames('symbol', { 'text-muted': props.token })}
          data-testid={FormDataTestIdsEnum.formatAmountSymbol}
        >
          {` ${props.token ?? props.egldLabel ?? erdLabel}`}
        </span>
      )}
    </span>
  );
};

export const FormatAmount = (props: FormatAmountPropsType) => {
  const erdLabel = getEgldLabel();

  if (!stringIsInteger(props.value, false)) {
    return formatAmountInvalid(props);
  }

  return formatAmountValid(props, erdLabel);
};
