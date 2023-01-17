import React from 'react';
import { DIGITS } from '@multiversx/sdk-dapp/constants';
import { formatAmount } from '@multiversx/sdk-dapp/utils/operations/formatAmount';
import { TokenIcon } from './TokenIcon';
import { TokenSymbol } from './TokenSymbol';
import { PartialTokenType } from 'types/tokens';

interface TokenElementPropsType {
  inDropdown?: boolean;
  token: PartialTokenType;
  isDisabled: boolean;
  handleDisabledOptionClick?: any;
  'data-testid'?: string;
}

export function TokenElement({
  inDropdown = false,
  token,
  isDisabled,
  'data-testid': dataTestId
}: TokenElementPropsType) {
  const disabledClass = isDisabled ? 'token-option-disabled' : '';
  const inDropdownClass = inDropdown ? 'in-dropdown' : 'd-none d-md-flex';

  const formattedAmount = formatAmount({
    input: token.balance,
    decimals: token.decimals,
    showLastNonZeroDecimal: true,
    addCommas: false,
    digits: DIGITS
  });

  return (
    <div
      className={`d-flex align-items-center justify-content-between token-element ${disabledClass}`}
      data-testid={dataTestId}
    >
      <div className='d-flex flex-row align-items-center'>
        <div className={`token-image mr-2 ${inDropdownClass}`}>
          <TokenIcon />
        </div>

        <div className='d-flex flex-column mex-text-main'>
          <TokenSymbol token={token} />
          {/* <small className='mex-text-secondary'>{token.usdPrice}</small> */}
        </div>
      </div>

      {inDropdown && (
        <div className='d-flex flex-column ml-spacer ml-lg-5 mex-text-main align-items-end'>
          {formattedAmount}

          {/* {token.totalUsdPrice && (
            <small className='mex-text-secondary'>
              {token.totalUsdPrice !== '$0' ? <>≈&nbsp;</> : <></>}
              {token.totalUsdPrice}
            </small>
          )} */}
        </div>
      )}
    </div>
  );
}
