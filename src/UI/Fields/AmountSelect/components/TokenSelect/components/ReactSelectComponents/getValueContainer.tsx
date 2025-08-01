import React, {
  JSXElementConstructor,
  PropsWithChildren,
  useMemo
} from 'react';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIdentifierType } from '@multiversx/sdk-dapp/out/utils/validation/getIdentifierType';
import classNames from 'classnames';
import { components } from 'react-select';
import MultiversXIcon from '../../../../../../../assets/icons/mx-icon.svg';

import type { OptionType } from '../../tokenSelect.types';

import styles from './../../tokenSelect.module.scss';

interface ValueComponentPropsType {
  EgldIcon?: JSXElementConstructor<any>;
  egldLabel: string;
  icon?: string | null;
  isDisabled?: boolean;
  tokenId?: string;
}

export const ValueComponent = ({
  EgldIcon,
  tokenId,
  icon
}: ValueComponentPropsType) => {
  const { isEgld } = getIdentifierType(tokenId);

  if (isEgld) {
    return (
      <span className={styles.asset}>
        {EgldIcon ? (
          <EgldIcon className={styles.diamond} />
        ) : (
          <MultiversXIcon className={styles.diamond} />
        )}
      </span>
    );
  }

  if (icon) {
    return <img src={icon} className={styles.asset} />;
  }

  return <FontAwesomeIcon icon={faDiamond} className={styles.asset} />;
};

const ValueWrapper = ({ children }: PropsWithChildren) =>
  process.env.NODE_ENV === 'test' ? (
    <>{children}</>
  ) : (
    <div className={styles.wrapper}>{children}</div>
  );

export const getValueContainer =
  (
    egldLabel: string,
    selectedTokenIconClassName?: string,
    EgldIcon?: JSXElementConstructor<any>
  ): typeof components.ValueContainer =>
  (props) => {
    const { selectProps, isDisabled, children } = props;

    const token = selectProps.value as unknown as OptionType;
    const icon = token?.assets?.svgUrl ?? null;
    const price = useMemo(() => {
      const strPrice = String(token?.token.usdPrice);
      if (strPrice?.includes('$')) {
        return token?.token.usdPrice;
      }
      return `$${token?.token.usdPrice}`;
    }, [token?.token.usdPrice]);

    return (
      <components.ValueContainer {...props} className={styles.container}>
        <div className={classNames(styles.icon, selectedTokenIconClassName)}>
          <ValueComponent
            EgldIcon={EgldIcon}
            egldLabel={egldLabel}
            icon={icon}
            isDisabled={isDisabled}
            tokenId={token?.value}
          />
        </div>

        <div className={styles.payload}>
          <ValueWrapper>
            {children}

            {token?.token.usdPrice && (
              <small className={styles.price}>{price}</small>
            )}
          </ValueWrapper>
        </div>
      </components.ValueContainer>
    );
  };
