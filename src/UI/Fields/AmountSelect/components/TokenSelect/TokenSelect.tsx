import React, { useMemo, useRef } from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';
import { getWegldIdForChainId } from 'apiCalls/network/getEnvironmentForChainId';
import * as components from './components';
import styles from './tokenSelect.module.scss';
import { OptionType, TokenSelectPropsType } from './tokenSelect.types';

const {
  Menu,
  Control,
  Input,
  MenuList,
  IndicatorsContainer,
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
    chainId,
    // handleDisabledOptionClick,
    wrapperClassName = ''
  } = props;
  const ref = useRef(null);
  const egldFamily = [egldLabel, getWegldIdForChainId(chainId)];
  const Option = useMemo(() => components.getOption(egldLabel), []);
  const ValueContainer = useMemo(
    () => components.getValueContainer(egldLabel),
    []
  );

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

  console.log('tokenSelectValue = ', value);

  return (
    <div
      data-testid={`${name}Select`}
      className={`${wrapperClassName} ${
        isLoading ? 'select-holder-loading' : ''
      }`}
    >
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
        isDisabled={disabled}
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
          [styles.disabled]: props.disabled
        })}
        components={{
          IndicatorSeparator: () => null,
          LoadingIndicator: () => null,
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
