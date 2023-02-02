import React from 'react';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { components } from 'react-select';

import { default as MultiversXIcon } from 'assets/icons/mx-icon.svg';

import type { OptionType } from '../../tokenSelect.types';

import styles from './../../tokenSelect.module.scss';
import { UsdValue } from '@multiversx/sdk-dapp/UI/UsdValue';
import { progressiveFormatAmount } from '../../../MaxButton/progressiveFormatAmount';

interface ValueComponentPropsType {
  isDisabled?: boolean;
  tokenId?: string;
  egldLabel: string;
  icon?: string | null;
}

const ValueComponent = ({
  tokenId,
  icon,
  egldLabel
}: ValueComponentPropsType) => {
  if (tokenId === egldLabel) {
    return (
      <span className={styles.asset}>
        <MultiversXIcon className={styles.diamond} />
      </span>
    );
  }
  if (icon) {
    return <img src={icon} className={styles.asset} />;
  }

  return <FontAwesomeIcon icon={faDiamond} className={styles.asset} />;
};

export const getValueContainer =
  (egldLabel: string): typeof components.ValueContainer =>
  (props) => {
    const { selectProps, isDisabled, children } = props;

    const token = selectProps.value as unknown as OptionType;
    const icon = token.assets ? token.assets.svgUrl : null;
    const price = progressiveFormatAmount({
      amount: token?.token.balance,
      decimals: token?.token.decimals,
      addCommas: true
    });

    return (
      <components.ValueContainer {...props} className={styles.container}>
        <div className={styles.icon}>
          <ValueComponent
            tokenId={token?.value}
            icon={icon}
            egldLabel={egldLabel}
            isDisabled={isDisabled}
          />
        </div>

        <div className={styles.payload}>
          {children}
          <small className={styles.price}>
            <UsdValue
              amount={price}
              usd={1}
              data-testid='usdValue'
              className='d-flex flex-column mex-text-main'
            />
          </small>
        </div>
      </components.ValueContainer>
    );
  };
