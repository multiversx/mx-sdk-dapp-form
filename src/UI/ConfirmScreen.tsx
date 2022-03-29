import React from 'react';
import {
  LoginMethodsEnum,
  useGetAccountProvider
} from '@elrondnetwork/dapp-core';
import { useSendFormContext } from 'contexts/SendFormProviderContext';
import { TxTypeEnum } from 'types';
import Confirm from './Confirm';

export const ConfirmScreen = () => {
  const { providerType } = useGetAccountProvider();
  const { tokensInfo, receiverInfo, amount, dataFieldInfo, formInfo, gasInfo } =
    useSendFormContext();
  const { tokenId, tokenDetails, nft, egldPriceInUsd, egldLabel } = tokensInfo;
  const {
    readonly,
    onCloseForm,
    onInvalidateForm,
    onSubmitForm,
    txType,
    hook
  } = formInfo;
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
          amount: String(amount.amount),
          isEsdtTransaction: txType !== TxTypeEnum.EGLD,
          tokenDenomination: tokenDetails.tokenDenomination,
          tokenId,
          egldLabel,
          tokenLabel: tokenDetails.tokenLabel,
          tokenAvatar: tokenDetails.tokenAvatar || '',
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
          className={`btn ${
            Boolean(scamError) ? 'btn-warning' : 'btn-primary'
          } px-spacer`}
          id='sendTrxBtn'
          data-testid='sendTrxBtn'
        >
          {confirmText}
        </button>
        {!hook && (
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
