import React, { useRef } from 'react';
import Select, { components } from 'react-select';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatTokenAmount } from './helpers/formatTokenAmount';
import { faCircleNotch, faDiamond } from '@fortawesome/free-solid-svg-icons';

import { getWegldIdForChainId } from 'apiCalls/network/getEnvironmentForChainId';
// import { SmallLoader } from './components';
import { TokenElement as DefaultTokenElement } from './components';
// import { customStyles } from './helpers';
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
    className={styles.input}
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
  const { data, isSelected, isFocused } = props;
  const option = data as unknown as OptionType;

  const icon = option.assets ? option.assets.svgUrl : null;
  const amount = formatTokenAmount({
    amount: option.token.balance,
    decimals: option.token.decimals,
    addCommas: true
  });

  return (
    <div data-testid={`${(props as any).value}-option`}>
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
            <span className={styles.value}>{option.token.ticker}</span>
            <small className={styles.price}>$0</small>
          </div>
          <div className={styles.right}>
            <span className={styles.value}>{amount}</span>
            <small className={styles.price}>≈ $0</small>
          </div>
        </div>
      </components.Option>
    </div>
  );
};

const ValueContainer: typeof components.ValueContainer = (props) => {
  const { selectProps, isDisabled } = props;

  const price = '$0';
  const token = selectProps.value as unknown as OptionType;
  const icon = token.assets ? token.assets.svgUrl : null;

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        {/* <components.Placeholder {...props} isFocused={true}>
          {selectProps.placeholder}
        </components.Placeholder> */}

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
    chainId
    // handleDisabledOptionClick,
  } = props;
  const ref = useRef(null);
  const egldFamily = [egldLabel, getWegldIdForChainId(chainId)];

  const isTokenFromEgldFamily = (identifier: string) =>
    egldFamily.includes(identifier);

  // const FormatOptionLabel =
  //   (testId?: string) =>
  //   (option: any, { context }: { context: any }) => {
  //     const { label, value: val, token } = option;
  //     const inDropdown = context === 'menu' ? true : false;
  //     const isDisabled = disableOption(option);

  //     const args = {
  //       inDropdown,
  //       label,
  //       value: val,
  //       egldLabel,
  //       token,
  //       isDisabled,
  //       handleDisabledOptionClick,
  //       'data-testid': `${testId}-${context}-${val}`
  //     };

  //     if (option.value === 'loader') {
  //       return (
  //         <div className='d-flex justify-content-center py-5'>
  //           <SmallLoader show />
  //         </div>
  //       );
  //     }

  //     return <TokenElement {...args} />;
  //   };

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

  return (
    <div data-testid={`${name}Select`}>
      <label
        htmlFor={name}
        data-testid='tokenIdLabel'
        className={styles.selectTokenLabel}
      >
        Token
      </label>
      <Select
        ref={ref}
        inputId={name}
        options={options}
        isDisabled={props.disabled || isLoading}
        value={props.value}
        isOptionDisabled={disableOption}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        onChange={(e) => {
          props.onChange(e);
          if (ref && ref.current !== null) {
            (ref.current as any).blur();
          }
        }}
        isSearchable={props.isSearchable}
        maxMenuHeight={260}
        onMenuOpen={() => {
          props.onMenuOpen?.();
        }}
        noOptionsMessage={() => noOptionsMessage}
        formatOptionLabel={(value) =>
          isLoading ? 'Loading...' : value.token.ticker || 'Select...'
        }
        className={classNames(styles.select, className, {
          [styles.disabled]: props.disabled || isLoading
        })}
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
