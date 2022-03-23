import React from 'react';
import {
  LoginMethodsEnum,
  useGetAccountProvider
} from '@elrondnetwork/dapp-core';
import { useSelector } from 'react-redux';
import { useSendFormContext } from 'contexts';
import { TxTypeEnum } from 'logic';
import Confirm from 'UI/Confirm';
import { hookSelector } from '../../../../../redux/selectors';

const ConfirmScreen = () => {
  const { providerType } = useGetAccountProvider();
  const { type: hook } = useSelector(hookSelector);
  const { tokensInfo, receiverInfo, amount, dataFieldInfo, formInfo, gasInfo } =
    useSendFormContext();
  const { tokenId, tokenDetails, nft, egldPriceInUsd, egldLabel } = tokensInfo;
  const { txType, readonly, onCloseForm, onInvalidateForm, onSubmitForm } =
    formInfo;
  const { data } = dataFieldInfo;
  const { receiver, scamError } = receiverInfo;
  const { feeLimit, gasCostError } = gasInfo;

  let sendText: string;
  let confirmText: string;

  switch (providerType) {
    case LoginMethodsEnum.walletconnect:
      sendText = 'Check your App';
      confirmText = 'Confirm & Check your App';
      break;
    case LoginMethodsEnum.ledger:
      sendText = 'Check your Ledger';
      confirmText = 'Confirm & Check your Ledger';
      break;
    default:
      sendText = 'Sending...';
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
      <Confirm.To {...{ receiver: receiver, nft }} scamReport={scamError} />

      <Confirm.Amount
        {...{
          amount: String(amount.value), // TODO: check
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

      <Confirm.Fee {...{ feeLimit, egldPriceInUsd }} />
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
