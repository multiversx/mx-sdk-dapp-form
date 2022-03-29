import React from 'react';
import { DappUI, nominate } from '@elrondnetwork/dapp-core';
import { denomination, decimals } from 'constants/index';
import { NftType, TxTypeEnum } from 'types';
import { UsdValue } from 'UI/UsdValue';
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
  tokenDenomination: number;
  txType: TxTypeEnum;
  nft?: NftType;
}

const Amount = (props: AmountPropsType) => {
  const {
    label = 'Amount',
    amount,
    txType,
    tokenDenomination,
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
                decimals={txType === TxTypeEnum.MetaESDT ? decimals : 0}
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
                    isEsdtTransaction ? tokenDenomination : denomination
                  )}
                  denomination={
                    isEsdtTransaction ? tokenDenomination : denomination
                  }
                  showLastNonZeroDecimal
                  showLabel={false}
                  token={isEsdtTransaction ? tokenLabel : egldLabel}
                  data-testid='confirmAmount'
                />
                {!isEsdtTransaction && (
                  <UsdValue
                    amount={amount}
                    egldPriceInUsd={egldPriceInUsd}
                    data-testid='confirmUsdValue'
                  />
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      )}
      <div className='col-6'>
        <Token
          {...{
            nft,
            isEsdtTransaction,
            tokenId,
            egldLabel,
            tokenIdError
          }}
        />
      </div>
    </div>
  );
};

export default Amount;
