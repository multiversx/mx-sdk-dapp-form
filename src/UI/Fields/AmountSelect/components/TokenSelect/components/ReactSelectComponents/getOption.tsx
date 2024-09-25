import React, { JSXElementConstructor } from 'react';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DECIMALS } from '@multiversx/sdk-dapp/constants';
import { UsdValue } from '@multiversx/sdk-dapp/UI/UsdValue';
import { getIdentifierType } from '@multiversx/sdk-dapp/utils/validation/getIdentifierType';
import classNames from 'classnames';
import { components } from 'react-select';

import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { WithStylesImportType } from 'hocs/withStyles';
import { HighlightText } from 'UI/HighlightText';

import { progressiveFormatAmount } from '../../../MaxButton/progressiveFormatAmount';
import type { OptionType, TokenSelectPropsType } from '../../tokenSelect.types';

export const {
  default: MultiversXIcon
} = require('./../../../../../../../assets/icons/mx-icon.svg');

export interface GetOptionPropsType extends WithStylesImportType {
  EgldIcon?: JSXElementConstructor<any>;
  TokenTickerIcon?: TokenSelectPropsType['TokenTickerIcon'];
  egldLabel: string;
  showBalanceUsdValue?: boolean;
  showTokenPrice?: boolean;
}

export const getOption =
  ({
    EgldIcon,
    TokenTickerIcon,
    showBalanceUsdValue,
    showTokenPrice,
    styles
  }: GetOptionPropsType): typeof components.Option =>
  (props) => {
    const { data, isSelected, isFocused, isDisabled, selectProps } = props;
    const option = data as unknown as OptionType;
    const { isEgld } = getIdentifierType(option.value);

    const icon = option.token.assets ? option.token.assets.svgUrl : null;
    const amount = progressiveFormatAmount({
      amount: option.token.balance,
      decimals: option.token.decimals || DECIMALS,
      addCommas: true
    });

    const tokenPrice = option.token?.usdPrice?.toString();
    const balanceUsdValue = option.token?.valueUSD?.toString();

    return (
      <div data-testid={`${(props as any).value}-option`}>
        <components.Option
          {...props}
          className={classNames(styles?.option, {
            [styles?.selected]: isSelected || isFocused,
            [styles?.disabled]: isDisabled
          })}
        >
          <div className={styles?.image}>
            {isEgld ? (
              <span className={styles?.icon}>
                {EgldIcon ? <EgldIcon /> : <MultiversXIcon />}
              </span>
            ) : icon ? (
              <img src={icon} className={styles?.icon} />
            ) : (
              <span className={styles?.icon}>
                <FontAwesomeIcon icon={faDiamond} className={styles?.diamond} />
              </span>
            )}
          </div>

          <div className={styles?.info}>
            <div className={styles?.left}>
              <div className={styles?.ticker}>
                <span className={styles?.value}>
                  {selectProps.inputValue ? (
                    <HighlightText
                      text={option.token.ticker}
                      highlight={selectProps.inputValue}
                    />
                  ) : (
                    option.token.ticker
                  )}
                </span>

                {TokenTickerIcon && <TokenTickerIcon token={option.token} />}
              </div>

              {showTokenPrice && (
                <small className={styles?.price}>{tokenPrice}</small>
              )}
            </div>
            <div className={styles?.right}>
              <span className={styles?.value}>{amount}</span>
              {showBalanceUsdValue && balanceUsdValue && (
                <UsdValue
                  usd={1}
                  decimals={4}
                  amount={balanceUsdValue}
                  data-testid={FormDataTestIdsEnum.tokenPriceUsdValue}
                  className={styles?.price}
                  addEqualSign={false}
                />
              )}
            </div>
          </div>

          <div className={styles?.children}>{props.children}</div>
        </components.Option>
      </div>
    );
  };
