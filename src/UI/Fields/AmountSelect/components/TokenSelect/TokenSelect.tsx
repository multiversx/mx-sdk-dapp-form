import React from 'react';
import Select, {
  ControlProps,
  IndicatorsContainerProps,
  InputProps,
  MenuListProps,
  MenuProps,
  PlaceholderProps,
  SingleValueProps,
  components
} from 'react-select';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatTokenAmount } from './helpers/formatTokenAmount';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';

import { getWegldIdForChainId } from 'apiCalls/network/getEnvironmentForChainId';
import { useNetworkConfigContext } from 'contexts/NetworkContext/NetworkContext';

import { SmallLoader, TokenElement as DefaultTokenElement } from './components';
import { customStyles } from './helpers';
import { PartialTokenType, TokenAssetsType } from 'types';
// import styles from './../../amountSelect.styles.scss';
import styles from './styles.module.scss';

export interface SelectOptionType {
  label: string;
  value: string;
}

export interface OptionType {
  value: string;
  label: string;
  assets?: TokenAssetsType;
  token: PartialTokenType;
}

export interface TokenSelectPropsType {
  id?: string;
  value?: OptionType;
  name: string;
  isLoading?: boolean;
  options: OptionType[];
  isSearchable?: boolean;
  className?: string;
  onChange: (option: any) => void;
  onBlur?: (option: any) => void;
  fullSize?: boolean;
  disabled?: boolean;
  error?: string;
  isInvalid?: boolean;
  noOptionsMessage?: string;
  hasLockedMEX?: boolean;
  hasLockedTokens?: boolean;
  onFocus?: (props: any) => void;
  disabledOption?: SelectOptionType;
  handleDisabledOptionClick?: any;
  /**
   * Allow passing a custom TokenElement
   * @example
   * TokenElement = hasLockedMEX || hasLockedTokens ? LockedTokenElement : TokenElement;
   */
  TokenElement?: typeof DefaultTokenElement;
}

// To be moved
const customComponents = {
  IndicatorSeparator: null,
  Menu: (props: any) => <components.Menu {...props} className={styles.menu} />,
  Control: (props: any) => (
    <components.Control {...props} className={styles.control} />
  ),
  Input: (props: any) => (
    <components.Input {...props} className={styles.input} />
  ),
  MenuList: (props: any) => (
    <components.MenuList {...props} className={styles.list} />
  ),
  SingleValue: (props: any) => (
    <components.SingleValue {...props} className={styles.single} />
  ),
  Placeholder: (props: any) => (
    <components.Placeholder
      {...props}
      className={classNames(styles.placeholder, {
        [styles.focused]: props.isFocused
      })}
    />
  ),
  IndicatorsContainer: (props: any) => (
    <components.IndicatorsContainer
      {...props}
      className={classNames(styles.indicator, {
        [styles.expanded]: props.selectProps.menuIsOpen
      })}
    />
  ),
  ValueContainer: (props: any) => {
    const { selectProps } = props;

    const price = '$0';
    const icon =
      selectProps.value && selectProps.value.assets
        ? selectProps.value.assets.svgUrl
        : null;

    return (
      <div className={styles.container}>
        <div className={styles.icon}>
          {icon ? (
            <img src={icon} className={styles.asset} />
          ) : (
            <span className={styles.asset}>
              <FontAwesomeIcon icon={faDiamond} className={styles.diamond} />
            </span>
          )}
        </div>

        <div className={styles.data}>
          <components.ValueContainer {...props} className={styles.value} />
          <small className={styles.price}>{price}</small>
        </div>
      </div>
    );
  },
  Option: (props: any) => {
    const { data, isSelected, isFocused } = props;

    const icon = data.assets ? data.assets.svgUrl : null;
    const amount = formatTokenAmount({
      amount: data.token.balance,
      decimals: data.token.decimals,
      addCommas: true
    });

    return (
      <components.Option
        {...props}
        className={classNames(styles.option, {
          [styles.selected]: isSelected || isFocused
        })}
      >
        <div className={styles.image}>
          {icon ? (
            <img src={icon} className={styles.icon} />
          ) : (
            <span className={styles.icon}>
              <FontAwesomeIcon icon={faDiamond} className={styles.diamond} />
            </span>
          )}
        </div>

        <div className={styles.info}>
          <div className={styles.left}>
            <span className={styles.value}>{data.token.ticker}</span>
            <small className={styles.price}>$0</small>
          </div>
          <div className={styles.right}>
            <span className={styles.value}>{amount}</span>
            <small className={styles.price}>≈ $0</small>
          </div>
        </div>
      </components.Option>
    );
  }
};

export const TokenSelect = ({
  id,
  name,
  value,
  options,
  isSearchable,
  className = '',
  onChange,
  onBlur,
  onFocus,
  fullSize,
  // hasLockedMEX,
  // hasLockedTokens,
  disabled = false,
  isLoading = false,
  noOptionsMessage = 'No Tokens',
  disabledOption,
  handleDisabledOptionClick,
  TokenElement = DefaultTokenElement
}: TokenSelectPropsType) => {
  const ref = React.useRef(null);
  const docStyle = window.getComputedStyle(document.documentElement);
  const customProps = {
    hoverColor: docStyle.getPropertyValue('--light'),
    primaryColor: docStyle.getPropertyValue('--primary'),
    bgColor: docStyle.getPropertyValue('--card-bg'),
    textColor: docStyle.getPropertyValue('--dark'),
    borderColor: docStyle.getPropertyValue('--border-color'),
    shadowColor: docStyle.getPropertyValue('--shadow-color'),
    fullSize
  };
  const selectStyle = customStyles({ customProps });

  const {
    networkConfig: { chainId, egldLabel }
  } = useNetworkConfigContext();

  const egldFamily = [egldLabel, getWegldIdForChainId(chainId)];

  const isTokenFromEgldFamily = (identifier: string) =>
    egldFamily.includes(identifier);

  const disableOption = (option: any) => {
    const isSameAsOtherSelectToken = option.value === disabledOption?.value;

    const isCurrentOptionEgldFamily = isTokenFromEgldFamily(option.value);
    const isOtherSelectTokenEgldFamily = isTokenFromEgldFamily(
      disabledOption?.value ?? ''
    );

    const isEgldFamily =
      isCurrentOptionEgldFamily && isOtherSelectTokenEgldFamily;

    return isSameAsOtherSelectToken || isEgldFamily;
  };

  const loaderOption: OptionType = {
    label: 'loader',
    value: 'loader',
    token: {} as any
  };

  const optionsWithLoader = isLoading ? [loaderOption, ...options] : options;

  return (
    <div data-testid={`${name}Select`}>
      <Select
        ref={ref}
        id={id}
        name={name}
        className={classNames(styles.select, className)}
        options={optionsWithLoader}
        value={value}
        isDisabled={disabled}
        isOptionDisabled={(option) => {
          const isLoader = option.value === loaderOption.value;
          const isDisabled = disableOption(option);
          return isLoader || isDisabled;
        }}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={(e) => {
          onChange(e);
          if (ref && ref.current !== null) {
            (ref.current as any).blur();
          }
        }}
        isSearchable={isSearchable}
        maxMenuHeight={260}
        // onMenuOpen={onMenuOpen}
        noOptionsMessage={() => noOptionsMessage || 'No options'}
        formatOptionLabel={(value) => value.token.ticker || 'Select...'}
        components={customComponents}
      />
    </div>
  );
};
