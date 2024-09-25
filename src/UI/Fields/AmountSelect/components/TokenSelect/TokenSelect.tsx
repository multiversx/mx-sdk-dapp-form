import React, { useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';

import { getWegldIdForChainId } from 'apiCalls/network/getEnvironmentForChainId';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';

import * as components from './components';
import { OptionType, TokenSelectPropsType } from './tokenSelect.types';

const {
  getMenu,
  getControl,
  getInput,
  getMenuList,
  getIndicatorsContainer,
  getPlaceholder
} = components;

export const TokenSelectComponent = (
  props: TokenSelectPropsType & WithStylesImportType
) => {
  const {
    name,
    options,
    isLoading = false,
    className = '',
    noOptionsMessage = 'No Tokens',
    disabledOption,
    egldLabel,
    EgldIcon,
    disabled,
    value,
    onBlur,
    onFocus,
    onChange,
    onMenuOpen,
    chainId,
    // handleDisabledOptionClick,
    wrapperClassName = '',
    showTokenPrice = false,
    showBalanceUsdValue = false,
    selectedTokenIconClassName,
    TokenTickerIcon,
    styles
  } = props;

  const ref = useRef(null);
  const egldFamily = [egldLabel, getWegldIdForChainId(chainId)];

  const Option = useMemo(
    () =>
      components.getOption({
        egldLabel,
        EgldIcon,
        showTokenPrice,
        showBalanceUsdValue,
        TokenTickerIcon,
        styles
      }),
    []
  );
  const ValueContainer = useMemo(
    () =>
      components.getValueContainer(
        egldLabel,
        selectedTokenIconClassName,
        EgldIcon,
        styles
      ),
    []
  );

  const SingleValue = useMemo(
    () => components.getSingleValue(TokenTickerIcon, styles),
    []
  );

  const updateSelectedOption = () => {
    const updatedOption = options.find(
      (option) => option.value === value?.value
    );

    const isSelectedOptionUpdated =
      updatedOption?.token.balance === value?.token.balance;

    if (!updatedOption || isSelectedOptionUpdated) {
      return;
    }

    onChange(updatedOption);
  };

  useEffect(updateSelectedOption, [options]);

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
  ) => {
    const isOptionFoundByTicker = option.data.token.ticker
      ? option.data.token.ticker.toLowerCase().includes(search.toLowerCase())
      : false;

    const isOptionFoundByName = option.data.token.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return Boolean(search)
      ? isOptionFoundByTicker || isOptionFoundByName
      : true;
  };

  return (
    <div
      data-testid={`${name}Select`}
      className={`${wrapperClassName} ${
        isLoading ? 'select-holder-loading' : ''
      }`}
    >
      {/* Label is only used in testing */}
      <label
        htmlFor={name}
        data-testid='tokenIdLabel'
        className={styles?.label}
      >
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
        className={classNames(styles?.select, className, {
          [styles?.disabled]: props.disabled
        })}
        components={{
          IndicatorSeparator: () => null,
          LoadingIndicator: () => null,
          Menu: getMenu(styles),
          Control: getControl(styles),
          Input: getInput(styles),
          MenuList: getMenuList(styles),
          IndicatorsContainer: getIndicatorsContainer(styles),
          Placeholder: getPlaceholder(styles),
          ValueContainer,
          Option,
          SingleValue
        }}
      />
    </div>
  );
};

export const TokenSelect = withStyles(TokenSelectComponent, {
  ssrStyles: () =>
    import('UI/Fields/AmountSelect/components/TokenSelect/styles.scss'),
  clientStyles: () =>
    require('UI/Fields/AmountSelect/components/TokenSelect/styles.scss').default
});
