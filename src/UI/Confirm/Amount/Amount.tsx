import React from 'react';
import { DECIMALS, DIGITS } from '@multiversx/sdk-dapp-utils/out';

import { parseAmount } from '@multiversx/sdk-dapp-utils/out/helpers/parseAmount';
import { getUsdValue } from '@multiversx/sdk-dapp/out/utils/operations/getUsdValue';
import globals from 'assets/sass/globals.module.scss';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { PartialNftType, TransactionTypeEnum } from 'types';
import { FormatAmount } from 'UI';

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
      showLastNonZeroDecimal
      data-testid={FormDataTestIdsEnum.confirmAmount}
    />
  ) : (
    <FormatAmount
      egldLabel={egldLabel}
      value={parseAmount(amount, decimals)}
      showLabel={false}
      decimals={decimals}
      showLastNonZeroDecimal
      token={isEsdtTransaction ? tokenLabel : egldLabel}
      data-testid={FormDataTestIdsEnum.confirmAmount}
    />
  );

  if (isNFT) {
    return null;
  }

  const usdValue = getUsdValue({
    amount,
    usd: egldPriceInUsd
  });

  return (
    <div className={styles.amount}>
      <span className={globals.label}>{label}</span>

      <div className={styles.token}>
        <TokenAvatar type={txType} avatar={tokenAvatar} />

        <div className={styles.value}>
          {amountRenderer} {tokenLabel}
        </div>
      </div>

      {!isEsdtTransaction && <small className={styles.price}>{usdValue}</small>}
    </div>
  );
};
