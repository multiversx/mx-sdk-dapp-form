import React from 'react';
import { DECIMALS, DIGITS } from '@multiversx/sdk-dapp/constants/index';
import { FormatAmount } from '@multiversx/sdk-dapp/UI/FormatAmount/FormatAmount';
import { UsdValue } from '@multiversx/sdk-dapp/UI/UsdValue/index';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { parseAmount } from 'helpers';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { PartialNftType, TransactionTypeEnum } from 'types';

import { TokenAvatar } from '../TokenAvatar';

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

export const AmountComponent = ({
  label = 'Amount',
  amount,
  txType,
  tokenDecimals,
  tokenId,
  egldLabel,
  egldPriceInUsd,
  nft,
  tokenAvatar,
  styles,
  globalStyles
}: AmountPropsType & WithStylesImportType) => {
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

  return (
    <div className={styles?.amount}>
      <span className={globalStyles?.label}>{label}</span>

      <div className={styles?.token}>
        <TokenAvatar type={txType} avatar={tokenAvatar} />

        <div className={styles?.value}>
          {amountRenderer} {tokenLabel}
        </div>
      </div>

      {!isEsdtTransaction && (
        <UsdValue
          amount={amount}
          usd={egldPriceInUsd}
          data-testid={FormDataTestIdsEnum.confirmUsdValue}
          className={styles?.price}
        />
      )}
    </div>
  );
};

export const Amount = withStyles(AmountComponent, {
  ssrStyles: () => import('UI/Confirm/Amount/styles.module.scss'),
  clientStyles: () => require('UI/Confirm/Amount/styles.module.scss').default
});
