import { getWegldIdForChainId } from 'apiCalls/network/getEnvironmentForChainId';
import { useNetworkConfigContext } from 'contexts/NetworkContext/NetworkContext';
import React from 'react';
import Select from 'react-select';
import { SmallLoader, TokenElement as DefaultTokenElement } from './components';
import { customStyles } from './helpers';
import { PartialTokenType, TokenAssetsType } from 'types';
import styles from './../../amountSelect.styles.scss';

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
        options={optionsWithLoader}
        placeholder='Select token'
        classNamePrefix='styled-select'
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
        styles={selectStyle}
        isSearchable={isSearchable}
        maxMenuHeight={260}
        // onMenuOpen={onMenuOpen}
        noOptionsMessage={() => noOptionsMessage || 'No options'}
        formatOptionLabel={FormatOptionLabel(id)}
      />
    </div>
  );
};
