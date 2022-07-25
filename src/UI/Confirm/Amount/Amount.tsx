import React from 'react';
import * as constants from '@elrondnetwork/dapp-core/constants';
import { Denominate, UsdValue } from '@elrondnetwork/dapp-core/UI';
import { nominate } from '@elrondnetwork/dapp-core/utils';

import { NftType, TxTypeEnum } from 'types';
import { Token } from '../Token';

import styles from './styles.module.scss';

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

  const denomination = isEsdtTransaction
    ? tokenDecimals
    : constants.denomination;

  const amountRenderer = showNftAmount ? (
    <Denominate
      egldLabel={props.egldLabel}
      value={value}
      denomination={nftDenomination}
      decimals={txType === TxTypeEnum.MetaESDT ? constants.decimals : 0}
      showLastNonZeroDecimal
      showLabel={false}
      data-testid='confirmAmount'
    />
  ) : (
    <>
      <Denominate
        egldLabel={props.egldLabel}
        value={nominate(amount, denomination)}
        denomination={denomination}
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
    </>
  );

  return (
    <div className={styles.amount}>
      {txType !== TxTypeEnum.NonFungibleESDT && (
        <div className={styles.left}>
          <span className={styles.label}>{label}</span>

          {amountRenderer}
        </div>
      )}

      <div className={styles.right}>
        <Token {...tokenProps} />
      </div>
    </div>
  );
};

export { Amount };
