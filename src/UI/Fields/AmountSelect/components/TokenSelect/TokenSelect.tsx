import { getWegldIdForChainId } from 'apiCalls/network/getEnvironmentForChainId';
import { useNetworkConfigContext } from 'contexts/NetworkContext/NetworkContext';
import React from 'react';
import Select from 'react-select';
import { SmallLoader, TokenElement } from './components';
import { customStyles } from './helpers';
import styles from './../../amountSelect.styles.scss';

export interface SelectOptionType {
  label: string;
  value: string;
  token: any;
}

export interface TokenSelectType {
  id?: string;
  value?: any;
  name: string;
  isLoading?: boolean;
  defaultValue?: any;
  options: any;
  isSearchable?: boolean;
  className?: string;
  onChange: (option: any) => void;
  onBlur?: (option: any) => void;
  fullSize?: boolean;
  disabled?: boolean;
  noOptionsMessage?: string;
  hasLockedMEX?: boolean;
  hasLockedTokens?: boolean;
  onFocus?: (props: any) => void;
  disabledOption?: SelectOptionType;
  handleDisabledOptionClick?: any;
}

export const TokenSelect = ({
  id,
  name,
  value,
  defaultValue,
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
  handleDisabledOptionClick
}: TokenSelectType) => {
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

  const FormatOptionLabel =
    (testId?: string) =>
    (option: any, { context }: { context: any }) => {
      const { label, value: val, token } = option;
      const inDropdown = context === 'menu' ? true : false;
      const isDisabled = disableOption(option);

      const args = {
        inDropdown,
        label,
        value: val,
        token,
        isDisabled,
        handleDisabledOptionClick,
        'data-testid': `${testId}-${context}-${val}`
      };

      if (option.value === 'loader') {
        return (
          <div className='d-flex justify-content-center py-5'>
            <SmallLoader show />
          </div>
        );
      }

      return <TokenElement {...args} />;
    };

  console.log({
    id,
    value,
    defaultValue,
    isSearchable,
    onChange,
    onBlur,
    onFocus,
    disabled,
    noOptionsMessage,
    FormatOptionLabel,
    selectStyle
  });

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

  const loaderOption = {
    label: 'loader',
    value: 'loader'
  };

  const optionsWithLoader = isLoading ? [loaderOption, ...options] : options;

  const colourOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true }
  ];

  return (
    <div
      className={`${styles.selectHolder} ${
        isLoading ? styles.selectHolderLoading : ''
      }`}
      data-testid={`${name}Select`}
    >
      <Select
        ref={ref}
        id={id}
        name={name}
        className={` ${styles.largeStyledSelectContainer} ${
          fullSize ? 'fullsize' : ''
        } ${className}`}
        defaultValue={colourOptions[0]}
        options={optionsWithLoader}
        placeholder='Select token'
        classNamePrefix='styled-select'
        value={value}
      />

      {/* <Select
     
        // onMenuOpen={onMenuOpen}
        isOptionDisabled={(option) => {
          const isLoader = option.value === loaderOption.value;
          const isDisabled = disableOption(option);

          return isLoader || isDisabled;
        }}
        isDisabled={disabled}
        // isLoading={isLoading}
        styles={selectStyle}
        noOptionsMessage={() => noOptionsMessage || 'No options'}
        maxMenuHeight={260}
        onChange={(e) => {
          onChange(e);

          if (ref && ref.current !== null) {
            (ref.current as any).blur();
          }
        }}
        onBlur={onBlur}
        onFocus={onFocus}
        isSearchable={isSearchable}
        defaultValue={defaultValue}
        formatOptionLabel={FormatOptionLabel(id)}
      /> */}
    </div>
  );
};
