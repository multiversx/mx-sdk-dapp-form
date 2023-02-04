import React, { useMemo } from 'react';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIdentifierType } from '@multiversx/sdk-dapp/utils/validation/getIdentifierType';
import { components } from 'react-select';
import type { OptionType } from '../../tokenSelect.types';

import styles from './../../tokenSelect.module.scss';
const MultiversXIcon =
  require('../../../../../../../assets/icons/mx-icon.svg').default;

interface ValueComponentPropsType {
  isDisabled?: boolean;
  tokenId?: string;
  egldLabel: string;
  icon?: string | null;
}

export const ValueComponent = ({ tokenId, icon }: ValueComponentPropsType) => {
  const { isEgld } = getIdentifierType(tokenId);

  if (isEgld) {
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
    const price = useMemo(() => {
      const strPrice = String(token?.token.usdPrice);
      if (strPrice?.includes('$')) {
        return token?.token.usdPrice;
      }
      return `$${token?.token.usdPrice}`;
    }, [token?.token.usdPrice]);

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
          {token?.token.usdPrice && (
            <small className={styles.price}>{price}</small>
          )}
        </div>
      </components.ValueContainer>
    );
  };
