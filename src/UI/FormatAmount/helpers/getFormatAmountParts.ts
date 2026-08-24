import { getEgldLabel } from '@multiversx/sdk-dapp/out/methods/network/getEgldLabel';
import {
  DIGITS,
  DECIMALS,
  ZERO
} from '@multiversx/sdk-dapp-utils/out/constants';
import { formatAmount } from '@multiversx/sdk-dapp-utils/out/helpers/formatAmount';
import { stringIsInteger } from '@multiversx/sdk-dapp-utils/out/helpers/stringIsInteger';
import { FormatAmountPropsType } from '../formatAmount.types';

export interface FormatAmountPartsType {
  isValid: boolean;
  label: string;
  valueDecimal: string;
  valueInteger: string;
}

export const getFormatAmountParts = (
  props: FormatAmountPropsType
): FormatAmountPartsType => {
  const { value, showLastNonZeroDecimal = false, token, egldLabel } = props;

  const label = ` ${token ?? egldLabel ?? getEgldLabel()}`.trimEnd();

  if (!stringIsInteger(value, false)) {
    return { isValid: false, label, valueDecimal: '', valueInteger: '' };
  }

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
      parts[1] = parts[1].replace(/0+$/, '');

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
  if (digits > 0 && hasNoDecimals && isNotZero && !showLastNonZeroDecimal) {
    let zeros = '';

    for (let i = 1; i <= digits; i++) {
      zeros = zeros + ZERO;
    }

    valueParts.push(zeros);
  }

  return {
    isValid: true,
    label,
    valueInteger: valueParts[0],
    valueDecimal: valueParts.length > 1 ? `.${valueParts[1]}` : ''
  };
};
