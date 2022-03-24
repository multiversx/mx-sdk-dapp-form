import React from 'react';
import { DappUI, nominate } from '@elrondnetwork/dapp-core';
import { denomination, decimals } from 'constants/index';
import { NftEnumType, NftType } from 'types';
import { UsdValue } from 'UI/UsdValue';
import Token from './Token';

export interface AmountPropsType {
  amount: string;
  tokenId: string;
  label?: string;
  egldLabel: string;
  tokenLabel: string;
  tokenAvatar: string;
  egldPriceInUsd: number;
  tokenDenomination: number;
  isEsdtTransaction: boolean;
  nft?: NftType;
}

const Amount = (props: AmountPropsType) => {
  const [view, setView] = React.useState({
    Amount: () => <React.Fragment></React.Fragment>
  });

  const {
    label = 'Amount',
    amount,
    isEsdtTransaction,
    tokenDenomination,
    tokenId,
    egldLabel: erdLabel,
    egldPriceInUsd,
    nft
  } = props;

  React.useEffect(() => {
    if (nft && amount) {
      const nftDenomination = nft?.decimals || 0;
      let value = amount;
      if (nft?.decimals && nft?.type === NftEnumType.MetaESDT) {
        value = nominate(amount, nft?.decimals);
      }

      const NewAmount = () => (
        <DappUI.Denominate
          value={value}
          denomination={nftDenomination}
          decimals={nft?.type === NftEnumType.MetaESDT ? decimals : 0}
          showLastNonZeroDecimal
          showLabel={false}
          data-testid='confirmAmount'
        />
      );

      setView({ Amount: NewAmount });
    } else {
      const NewAmount = () => (
        <React.Fragment>
          <DappUI.Denominate
            value={nominate(
              amount,
              isEsdtTransaction ? tokenDenomination : denomination
            )}
            denomination={isEsdtTransaction ? tokenDenomination : denomination}
            showLastNonZeroDecimal
            showLabel={false}
            token={isEsdtTransaction ? tokenId.split('-')[0] : erdLabel}
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
      );

      setView({ Amount: NewAmount });
    }
  }, [nft, amount, isEsdtTransaction]);

  return (
    <div className='row'>
      {nft?.type !== NftEnumType.NonFungibleESDT && (
        <div className='col-6'>
          <div className='form-group'>
            <span className='form-label text-secondary d-block'>{label}</span>
            <view.Amount />
          </div>
        </div>
      )}
      <div className='col-6'>
        <Token />
      </div>
    </div>
  );
};

export default Amount;
