import React from 'react';
import { faCircleNotch, faDiamond } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { components } from 'react-select';
import { OptionType } from '../../tokenSelect.types';
import styles from './../../tokenSelect.module.scss';
const MultiversXIcon = require('./mx-icon.svg').default;

interface ValueComponentPropsType {
  isDisabled?: boolean;
  tokenId?: string;
  egldLabel: string;
  icon?: string | null;
}

const ValueComponent = ({
  isDisabled,
  tokenId,
  icon,
  egldLabel
}: ValueComponentPropsType) => {
  if (isDisabled) {
    return (
      <span className={styles.asset}>
        <FontAwesomeIcon
          icon={faCircleNotch}
          className={styles.diamond}
          spin={true}
        />
      </span>
    );
  }
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

    const price = '$0';
    const token = selectProps.value as unknown as OptionType;
    const icon = token.assets ? token.assets.svgUrl : null;

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
          <small className={styles.price}>{price}</small>
        </div>
      </components.ValueContainer>
    );
  };
