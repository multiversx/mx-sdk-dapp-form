import React from 'react';
import {
  LoginMethodsEnum,
  useGetAccountProvider
} from '@elrondnetwork/dapp-core';
import classNames from 'classnames';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import Confirm from './Confirm';

interface ConfirmScreenType {
  isConfirmCloseBtnVisible?: boolean;
}

export const ConfirmScreen = ({
  isConfirmCloseBtnVisible = true
}: ConfirmScreenType) => {
  const { providerType } = useGetAccountProvider();
  const {
    tokensInfo,
    receiverInfo,
    amountInfo,
    dataFieldInfo,
    formInfo,
    gasInfo
  } = useSendFormContext();
  const { tokenId, tokenDetails, nft, egldPriceInUsd, egldLabel } = tokensInfo;
  const { readonly, onCloseForm, onInvalidateForm, onSubmitForm, txType } =
    formInfo;
  const { data } = dataFieldInfo;
  const { receiver, scamError } = receiverInfo;
  const { feeLimit, gasCostError } = gasInfo;

  let confirmText: string;

  switch (providerType) {
    case LoginMethodsEnum.walletconnect:
      confirmText = 'Confirm & Check your App';
      break;
    case LoginMethodsEnum.ledger:
      confirmText = 'Confirm & Check your Ledger';
      break;
    default:
      confirmText = 'Confirm';
      break;
  }

  const onCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (readonly) {
      onCloseForm();
    } else {
      onInvalidateForm();
    }
  };

  return (
    <div className='text-left'>
      <Confirm.To {...{ receiver, nft }} scamReport={scamError} />

      <Confirm.Amount
        {...{
          amount: String(amountInfo.amount),
          txType,
          tokenDecimals: tokenDetails.decimals,
          tokenId,
          egldLabel,
          tokenLabel: tokenDetails.name,
          tokenAvatar: tokenDetails.assets?.svgUrl || '',
          egldPriceInUsd,
          nft
        }}
      />

      <Confirm.Fee {...{ feeLimit, egldPriceInUsd, egldLabel }} />
      <Confirm.Data {...{ data, egldPriceInUsd }} />

      <div className='d-flex align-items-center flex-column mt-spacer'>
        {gasCostError && (
          <p className='text-danger'>
            {`Transaction simulation has failed with error ${gasCostError}`}
          </p>
        )}

        <button
          onClick={onSubmitForm}
          className={classNames('btn px-spacer', {
            'btn-warning': Boolean(scamError),
            'btn-primary': !Boolean(scamError)
          })}
          id='sendTrxBtn'
          data-testid='sendTrxBtn'
        >
          {confirmText}
        </button>
        {isConfirmCloseBtnVisible && (
          <a
            href='/#'
            className='mt-3'
            id='cancelTrxBtn'
            data-testid='cancelTrxBtn'
            onClick={onCloseClick}
          >
            {readonly ? 'Close' : 'Back'}
          </a>
        )}
      </div>
    </div>
  );
};

export default ConfirmScreen;
