import React from 'react';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UsdValue } from '@multiversx/sdk-dapp/UI/UsdValue';
import { getIdentifierType } from '@multiversx/sdk-dapp/utils/validation/getIdentifierType';
import classNames from 'classnames';
import { components } from 'react-select';

import { progressiveFormatAmount } from '../../../MaxButton/progressiveFormatAmount';
import type { OptionType } from '../../tokenSelect.types';

import styles from './../../tokenSelect.module.scss';
import { HighlightText } from './HighlightText';

const MultiversXIcon =
  require('../../../../../../../assets/icons/mx-icon.svg').default;

export const getOption =
  ({
    showTokenPrice,
    showBalanceUsdValue
  }: {
    egldLabel: string;
    showTokenPrice?: boolean;
    showBalanceUsdValue?: boolean;
  }): typeof components.Option =>
  (props) => {
    const { data, isSelected, isFocused, selectProps } = props;
    const option = data as unknown as OptionType;

    const icon = option.token.assets ? option.token.assets.svgUrl : null;
    const amount = progressiveFormatAmount({
      amount: option.token.balance,
      decimals: option.token.decimals,
      addCommas: true
    });

    const tokenPrice = option.token?.usdPrice?.toString();

    const ticker = Boolean(selectProps.inputValue)
      ? HighlightText(option.token.ticker, selectProps.inputValue)
      : option.token.ticker;

    const { isEgld } = getIdentifierType(option.value);

    return (
      <div data-testid={`${(props as any).value}-option`}>
        <components.Option
          {...props}
          className={classNames(styles.option, {
            [styles.selected]: isSelected || isFocused
          })}
        >
          <div className={styles.image}>
            {isEgld ? (
              <span className={styles.icon}>
                <MultiversXIcon
                  is='x3d' // fixes jest Warning: The tag <default> is unrecognized in this browser.
                />
              </span>
            ) : icon ? (
              <img src={icon} className={styles.icon} />
            ) : (
              <span className={styles.icon}>
                <FontAwesomeIcon icon={faDiamond} className={styles.diamond} />
              </span>
            )}
          </div>

          <div className={styles.info}>
            <div className={styles.left}>
              <span className={styles.value}>{ticker}</span>
              {showTokenPrice && (
                <small className={styles.price}>
                  <small className={styles.price}>{tokenPrice}</small>
                </small>
              )}
            </div>
            <div className={styles.right}>
              <span className={styles.value}>{amount}</span>
              {showBalanceUsdValue && (
                <UsdValue
                  amount={amount}
                  usd={1}
                  data-testid='token-price-usd-value'
                  className='d-flex flex-column mex-text-main'
                />
              )}
            </div>
          </div>

          <div className={styles.children}>{props.children}</div>
        </components.Option>
      </div>
    );
  };
