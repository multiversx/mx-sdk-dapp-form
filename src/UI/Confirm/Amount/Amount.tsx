import React from 'react';
import { DECIMALS, DIGITS } from '@multiversx/sdk-dapp/constants/index';
import { FormatAmount } from '@multiversx/sdk-dapp/UI/FormatAmount/FormatAmount';
import { UsdValue } from '@multiversx/sdk-dapp/UI/UsdValue/index';
import classNames from 'classnames';

import { parseAmount } from 'helpers';
import { PartialNftType, TransactionTypeEnum } from 'types';
import { Token } from '../Token';

import globals from 'assets/sass/globals.module.scss';
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
  tokenIdError,
  egldLabel,
  egldPriceInUsd,
  nft
}: AmountPropsType) => {
  const nftDecimals = nft?.decimals || 0;
  const isEsdtTransaction = txType === TransactionTypeEnum.ESDT;
  const isMetaEsdt = txType === TransactionTypeEnum.MetaESDT;

  const value = isMetaEsdt ? parseAmount(amount, nft?.decimals) : amount;
  const showNftAmount = Boolean(nft && amount);
  const tokenLabel = tokenId.split('-')[0];
  const tokenProps = {
    nft,
    isEsdtTransaction,
    tokenId,
    egldLabel,
    tokenIdError
  };

  const decimals = isEsdtTransaction ? tokenDecimals : DECIMALS;

  const amountRenderer = showNftAmount ? (
    <FormatAmount
      egldLabel={egldLabel}
      value={value}
      decimals={nftDecimals}
      digits={txType === TransactionTypeEnum.MetaESDT ? DIGITS : 0}
      showLastNonZeroDecimal
      showLabel={false}
      data-testid='confirmAmount'
    />
  ) : (
    <>
      <FormatAmount
        egldLabel={egldLabel}
        value={parseAmount(amount, decimals)}
        decimals={decimals}
        showLastNonZeroDecimal
        showLabel={false}
        token={isEsdtTransaction ? tokenLabel : egldLabel}
        data-testid='confirmAmount'
      />

      {!isEsdtTransaction && (
        <div className={styles.price}>
          <UsdValue
            amount={amount}
            usd={egldPriceInUsd}
            data-testid='confirmUsdValue'
          />
        </div>
      )}
    </>
  );

  return (
    <div className={styles.amount}>
      {txType !== TransactionTypeEnum.NonFungibleESDT && (
        <div className={styles.left}>
          <span className={globals.label}>{label}</span>
          <span className={classNames(globals.value, styles.value)}>
            {amountRenderer}
          </span>
        </div>
      )}

      <div className={styles.right}>
        <Token {...tokenProps} />
      </div>
    </div>
  );
};
