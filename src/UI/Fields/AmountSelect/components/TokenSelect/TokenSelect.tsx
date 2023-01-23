import React, { useRef } from 'react';
import Select, { components } from 'react-select';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatTokenAmount } from '../../helpers/formatTokenAmount';
import { faDiamond, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

import { getWegldIdForChainId } from 'apiCalls/network/getEnvironmentForChainId';
import { TokenElement as DefaultTokenElement } from './components';
import { PartialTokenType, TokenAssetsType } from 'types';
import styles from './styles.module.scss';
// import { TokenElement } from 'UI/Fields/SelectToken/TokenElement';
import { highlightText } from './helpers/highlightText';
import { useNetworkConfigContext } from 'contexts';
const MultiversXIcon = require('./mx-icon.svg').default;

export interface SelectOptionType {
  label: string;
  value: string;
}

export interface OptionType {
  value: string;
  label: string;
  assets?: TokenAssetsType;
  token: PartialTokenType & {
    tokenUsdPrice?: number;
  };
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
  onMenuOpen?: () => void;
  disabled?: boolean;
  error?: string;
  egldLabel: string;
  chainId: string;
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

const Input: typeof components.Input = (props) => (
  <components.Input
    {...props}
    className={styles.dropdown}
    data-testid='tokenSelectInput'
  />
);

const Menu: typeof components.Menu = (props) => (
  <components.Menu {...props} className={styles.menu} />
);

const MenuList: typeof components.MenuList = (props) => (
  <components.MenuList {...props} className={styles.list} />
);

const SingleValue: typeof components.SingleValue = (props) => (
  <components.SingleValue {...props} className={styles.single} />
);

const Control: typeof components.Control = (props) => (
  <components.Control {...props} className={styles.control} />
);

const Placeholder: typeof components.Placeholder = (props) => (
  <components.Placeholder
    {...props}
    className={classNames(styles.placeholder, {
      [styles.focused]: props.isFocused
    })}
  />
);

const IndicatorsContainer: typeof components.IndicatorsContainer = (props) => (
  <components.IndicatorsContainer
    {...props}
    className={classNames(styles.indicator, {
      [styles.expanded]: props.selectProps.menuIsOpen
    })}
  />
);

const Option: typeof components.Option = (props) => {
  const { data, isSelected, isFocused, selectProps } = props;
  const option = data as unknown as OptionType;

  const {
    networkConfig: { egldLabel }
  } = useNetworkConfigContext();

  const icon = option.assets ? option.assets.svgUrl : null;
  const amount = formatTokenAmount({
    amount: option.token.balance,
    decimals: option.token.decimals,
    addCommas: true
  });

  const ticker = Boolean(selectProps.inputValue)
    ? highlightText(option.token.ticker, selectProps.inputValue)
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

const ValueContainer: typeof components.ValueContainer = (props) => {
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

export const TokenSelect = (
  props: // TokenElement = DefaultTokenElement
  TokenSelectPropsType
) => {
  const {
    name,
    options,
    isLoading = false,
    className = '',
    noOptionsMessage = 'No Tokens',
    disabledOption,
    egldLabel,
    disabled,
    value,
    onBlur,
    onFocus,
    onChange,
    onMenuOpen,
    chainId
    // handleDisabledOptionClick,
  } = props;
  const ref = useRef(null);
  const egldFamily = [egldLabel, getWegldIdForChainId(chainId)];

  const isTokenFromEgldFamily = (identifier: string) =>
    egldFamily.includes(identifier);

  const disableOption = (option: OptionType) => {
    const isSameAsOtherSelectToken = option.value === disabledOption?.value;

    const isCurrentOptionEgldFamily = isTokenFromEgldFamily(option.value);
    const isOtherSelectTokenEgldFamily = isTokenFromEgldFamily(
      disabledOption?.value ?? ''
    );

    const isEgldFamily =
      isCurrentOptionEgldFamily && isOtherSelectTokenEgldFamily;

    return isSameAsOtherSelectToken || isEgldFamily;
  };

  // const FormatOptionLabel = ({ token }: { token: PartialTokenType }) => {
  //   return (
  //     <TokenElement
  //       inDropdown
  //       token={token}
  //       isEgld={token.identifier === egldLabel}
  //     />
  //   );
  // };

  const filterOption = (
    option: FilterOptionOption<OptionType>,
    search: string
  ) =>
    option.data.token.ticker && Boolean(search)
      ? option.data.token.ticker.toLowerCase().includes(search.toLowerCase())
      : true;

  return (
    <div data-testid={`${name}Select`}>
      {/* TODO: label can be hidden, and shown only in tests */}
      <label htmlFor={name} data-testid='tokenIdLabel' className={styles.label}>
        Token
      </label>

      <Select
        ref={ref}
        inputId={name}
        name={name}
        options={options}
        openMenuOnFocus
        isDisabled={disabled || isLoading}
        isLoading={isLoading}
        value={value}
        isOptionDisabled={disableOption}
        onBlur={onBlur}
        filterOption={filterOption}
        onFocus={onFocus}
        onChange={(e) => {
          onChange(e);
          if (ref && ref.current !== null) {
            (ref.current as any).blur();
          }
        }}
        isSearchable={props.isSearchable}
        maxMenuHeight={260}
        onMenuOpen={onMenuOpen}
        noOptionsMessage={() => noOptionsMessage}
        // formatOptionLabel={FormatOptionLabel}
        // formatOptionLabel={(value) =>
        //   isLoading ? 'Loading...' : value.token.ticker
        // }
        className={classNames(styles.select, className, {
          [styles.disabled]: props.disabled || isLoading
        })}
        menuIsOpen
        components={{
          IndicatorSeparator: null,
          Menu,
          Control,
          Input,
          MenuList,
          IndicatorsContainer,
          ValueContainer,
          Placeholder,
          Option,
          SingleValue
        }}
      />
    </div>
  );
};
