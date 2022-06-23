import React from 'react';
import * as constants from '@elrondnetwork/dapp-core/constants';
import * as DappUI from '@elrondnetwork/dapp-core/UI';
import { nominate } from '@elrondnetwork/dapp-core/utils';

import { NftType, TxTypeEnum } from 'types';
import Token from './Token';

export interface AmountPropsType {
  amount: string;
  tokenId: string;
  tokenIdError?: string;
  label?: string;
  egldLabel: string;
  tokenLabel: string;
  tokenAvatar: string;
  egldPriceInUsd: number;
  tokenDecimals: number;
  txType: TxTypeEnum;
  nft?: NftType;
}

const Amount = (props: AmountPropsType) => {
  const {
    label = 'Amount',
    amount,
    txType,
    tokenDecimals,
    tokenId,
    tokenIdError,
    egldLabel,
    egldPriceInUsd,
    nft
  } = props;

  const nftDenomination = nft?.decimals || 0;
  const isEsdtTransaction = txType === TxTypeEnum.ESDT;
  const isMetaEsdt = txType === TxTypeEnum.MetaESDT;
  const value = isMetaEsdt ? nominate(amount, nft?.decimals) : amount;
  const showNftAmount = Boolean(nft && amount);
  const tokenLabel = tokenId.split('-')[0];
  const tokenProps = {
    nft,
    isEsdtTransaction,
    tokenId,
    egldLabel,
    tokenIdError
  };

  return (
    <div className='row'>
      {txType !== TxTypeEnum.NonFungibleESDT && (
        <div className='col-6'>
          <div className='form-group'>
            <span className='form-label text-secondary d-block'>{label}</span>
            {showNftAmount ? (
              <DappUI.Denominate
                egldLabel={props.egldLabel}
                value={value}
                denomination={nftDenomination}
                decimals={
                  txType === TxTypeEnum.MetaESDT ? constants.decimals : 0
                }
                showLastNonZeroDecimal
                showLabel={false}
                data-testid='confirmAmount'
              />
            ) : (
              <React.Fragment>
                <DappUI.Denominate
                  egldLabel={props.egldLabel}
                  value={nominate(
                    amount,
                    isEsdtTransaction ? tokenDecimals : constants.denomination
                  )}
                  denomination={
                    isEsdtTransaction ? tokenDecimals : constants.denomination
                  }
                  showLastNonZeroDecimal
                  showLabel={false}
                  token={isEsdtTransaction ? tokenLabel : egldLabel}
                  data-testid='confirmAmount'
                />
                {!isEsdtTransaction && (
                  <DappUI.UsdValue
                    amount={amount}
                    usd={egldPriceInUsd}
                    data-testid='confirmUsdValue'
                  />
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      )}
      <div className='col-6'>
        <Token {...tokenProps} />
      </div>
    </div>
  );
};

export default Amount;
