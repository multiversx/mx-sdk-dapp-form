import React from 'react';
import classNames from 'classnames';
import { components } from 'react-select';
import styles from './../styles.module.scss';
import { progressiveFormatAmount } from '../../MaxButton/progressiveFormatAmount';
import { HighlightText } from './HighlightText';
import { OptionType } from '../tokenSelect.types';
const MultiversXIcon = require('./mx-icon.svg').default;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

export const Input: typeof components.Input = (props) => (
  <components.Input
    {...props}
    className={styles.dropdown}
    data-testid='tokenSelectInput'
  />
);

export const Menu: typeof components.Menu = (props) => (
  <components.Menu {...props} className={styles.menu} />
);

export const MenuList: typeof components.MenuList = (props) => (
  <components.MenuList {...props} className={styles.list} />
);

export const SingleValue: typeof components.SingleValue = (props) => (
  <components.SingleValue {...props} className={styles.single} />
);

export const Control: typeof components.Control = (props) => (
  <components.Control {...props} className={styles.control} />
);

export const Placeholder: typeof components.Placeholder = (props) => (
  <components.Placeholder
    {...props}
    className={classNames(styles.placeholder, {
      [styles.focused]: props.isFocused
    })}
  />
);

export const IndicatorsContainer: typeof components.IndicatorsContainer = (
  props
) => (
  <components.IndicatorsContainer
    {...props}
    className={classNames(styles.indicator, {
      [styles.expanded]: props.selectProps.menuIsOpen
    })}
  />
);

export const optionGeneragtor =
  (egldLabel: string): typeof components.Option =>
  (props) => {
    const { data, isSelected, isFocused, selectProps } = props;
    const option = data as unknown as OptionType;

    const icon = option.assets ? option.assets.svgUrl : null;
    const amount = progressiveFormatAmount({
      amount: option.token.balance,
      decimals: option.token.decimals,
      addCommas: true
    });

    const ticker = Boolean(selectProps.inputValue)
      ? HighlightText(option.token.ticker, selectProps.inputValue)
      : option.token.ticker;

    return (
      <div data-testid={`${(props as any).value}-option`} {...props}>
        <components.Option
          {...props}
          className={classNames(styles.option, {
            [styles.selected]: isSelected || isFocused
          })}
        >
          <div className={styles.image}>
            {ticker === egldLabel ? (
              <span className={styles.icon}>
                <MultiversXIcon />
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
              <small className={styles.price}>$0</small>
            </div>
            <div className={styles.right}>
              <span className={styles.value}>{amount}</span>
              <small className={styles.price}>≈ $0</small>
            </div>
          </div>

          <div style={{ display: 'none' }}>{props.children}</div>
        </components.Option>
      </div>
    );
  };

export const ValueContainer: typeof components.ValueContainer = (props) => {
  const { selectProps, isDisabled, children } = props;

  const price = '$0';
  const token = selectProps.value as unknown as OptionType;
  const icon = token.assets ? token.assets.svgUrl : null;

  return (
    <components.ValueContainer {...props} className={styles.container}>
      <div className={styles.icon}>
        {isDisabled ? (
          <span className={styles.asset}>
            <FontAwesomeIcon
              icon={faCircleNotch}
              className={styles.diamond}
              spin={true}
            />
          </span>
        ) : icon ? (
          <img src={icon} className={styles.asset} />
        ) : (
          <span className={styles.asset}>
            <MultiversXIcon className={styles.diamond} />
          </span>
        )}
      </div>

      <div className={styles.payload}>
        {children}
        <small className={styles.price}>{price}</small>
      </div>
    </components.ValueContainer>
  );
};
