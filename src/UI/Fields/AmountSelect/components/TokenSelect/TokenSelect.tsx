import React, { useRef } from 'react';
import Select from 'react-select';
import classNames from 'classnames';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';
import { getWegldIdForChainId } from 'apiCalls/network/getEnvironmentForChainId';
import * as components from './components';
import { OptionType, TokenSelectPropsType } from './tokenSelect.types';
import styles from './styles.module.scss';

const {
  Menu,
  Control,
  Input,
  MenuList,
  IndicatorsContainer,
  ValueContainer,
  Placeholder,
  SingleValue
} = components;

export const TokenSelect = (props: TokenSelectPropsType) => {
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
  const Option = components.optionGeneragtor(egldLabel);

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

  const filterOption = (
    option: FilterOptionOption<OptionType>,
    search: string
  ) =>
    option.data.token.ticker && Boolean(search)
      ? option.data.token.ticker.toLowerCase().includes(search.toLowerCase())
      : true;

  return (
    <div data-testid={`${name}Select`}>
      {/* Label is only used in testing */}
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
