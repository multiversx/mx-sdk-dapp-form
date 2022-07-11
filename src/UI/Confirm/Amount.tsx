import React from 'react';
import {
  decimals,
  denomination
} from '@elrondnetwork/dapp-core/constants/index';
import { Denominate } from '@elrondnetwork/dapp-core/UI/Denominate';
import { UsdValue } from '@elrondnetwork/dapp-core/UI/UsdValue';
import { nominate } from '@elrondnetwork/dapp-core/utils/operations/nominate';

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
              <Denominate
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
                <Denominate
                  egldLabel={props.egldLabel}
                  value={nominate(
                    amount,
                    isEsdtTransaction ? tokenDecimals : denomination
                  )}
                  denomination={
                    isEsdtTransaction ? tokenDecimals : denomination
                  }
                  showLastNonZeroDecimal
                  showLabel={false}
                  token={isEsdtTransaction ? tokenLabel : egldLabel}
                  data-testid='confirmAmount'
                />
                {!isEsdtTransaction && (
                  <UsdValue
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
