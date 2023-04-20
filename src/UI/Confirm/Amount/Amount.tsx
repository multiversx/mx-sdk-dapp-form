import React from 'react';
import { DECIMALS, DIGITS } from '@multiversx/sdk-dapp/constants/index';
import { FormatAmount } from '@multiversx/sdk-dapp/UI/FormatAmount/FormatAmount';
import { UsdValue } from '@multiversx/sdk-dapp/UI/UsdValue/index';

import globals from 'assets/sass/globals.module.scss';
import { parseAmount } from 'helpers';
import { PartialNftType, TransactionTypeEnum } from 'types';

import { TokenAvatar } from '../TokenAvatar';

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
  txType: TransactionTypeEnum;
  nft?: PartialNftType;
}

export const Amount = ({
  label = 'Amount',
  amount,
  txType,
  tokenDecimals,
  tokenId,
  egldLabel,
  egldPriceInUsd,
  nft,
  tokenAvatar
}: AmountPropsType) => {
  const nftDecimals = nft?.decimals || 0;
  const isEsdtTransaction = txType === TransactionTypeEnum.ESDT;
  const isMetaEsdt = txType === TransactionTypeEnum.MetaESDT;
  const isNFT = txType === TransactionTypeEnum.NonFungibleESDT;

  const value = isMetaEsdt ? parseAmount(amount, nft?.decimals) : amount;
  const showNftAmount = Boolean(nft && amount);
  const tokenLabel = tokenId.split('-')[0];

  const decimals = isEsdtTransaction ? tokenDecimals : DECIMALS;

  const amountRenderer = showNftAmount ? (
    <FormatAmount
      egldLabel={egldLabel}
      value={value}
      decimals={nftDecimals}
      digits={txType === TransactionTypeEnum.MetaESDT ? DIGITS : 0}
      showLabel={false}
      showLastNonZeroDecimal={true}
      data-testid='confirmAmount'
    />
  ) : (
    <FormatAmount
      egldLabel={egldLabel}
      value={parseAmount(amount, decimals)}
      showLabel={false}
      decimals={decimals}
      showLastNonZeroDecimal={true}
      token={isEsdtTransaction ? tokenLabel : egldLabel}
      data-testid='confirmAmount'
    />
  );

  if (isNFT) {
    return null;
  }

  return (
    <div className={styles.amount}>
      <span className={globals.label}>{label}</span>

      <div className={styles.token}>
        <TokenAvatar type={txType} avatar={tokenAvatar} />

        <div className={styles.value}>
          {amountRenderer} {tokenLabel}
        </div>
      </div>

      {!isEsdtTransaction && (
        <UsdValue
          amount={amount}
          usd={egldPriceInUsd}
          data-testid='confirmUsdValue'
          className={styles.price}
        />
      )}
    </div>
  );
};
