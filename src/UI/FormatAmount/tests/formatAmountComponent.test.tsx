import React from 'react';
import { MAINNET_EGLD_LABEL } from '@multiversx/sdk-dapp/out/constants/network.constants';
import { render } from '@testing-library/react';
import { FormatAmountPropsType } from 'UI/FormatAmount/formatAmount.types';
import { FormatAmount } from '../FormatAmount';

const renderComponent = async (props: FormatAmountPropsType) => {
  const methods = render(<FormatAmount {...props} egldLabel='EGLD' />);

  return await methods.findByTestId('formatAmountComponent');
};

const decimalsSelector = (component: HTMLElement) =>
  component.querySelectorAll('span[data-testid=formatAmountDecimals]')[0]
    ?.textContent;

const symbolSelector = (component: HTMLElement) =>
  component.querySelectorAll('span[data-testid=formatAmountSymbol]').length;

describe('Format amount component when digits = 2', () => {
  it('should show 2 non zero decimals ', async () => {
    const props = {
      value: '9999979999800000000000000',
      showLastNonZeroDecimal: false,
      showLabel: true,
      digits: 2,
      egldLabel: MAINNET_EGLD_LABEL
    };

    const component = await renderComponent(props);

    expect(decimalsSelector(component)).toBe('.99');
  });

  it('should show 2 zero decimals', async () => {
    const props = {
      value: '9000000000000000000000000',
      showLastNonZeroDecimal: false,
      showLabel: true,
      digits: 2,
      egldLabel: MAINNET_EGLD_LABEL
    };

    const component = await renderComponent(props);

    expect(decimalsSelector(component)).toBe('.00');
  });

  it('should show all non zero decimals when showLastNonZeroDecimal = true', async () => {
    const props = {
      value: '100000000000000',
      showLastNonZeroDecimal: true,
      showLabel: false,
      digits: 2,
      egldLabel: MAINNET_EGLD_LABEL
    };

    const component = await renderComponent(props);
    expect(decimalsSelector(component)).toBe('.0001');
  });

  it('should not show decimals when value is 0', async () => {
    const props = {
      value: '100000000000000',
      showLastNonZeroDecimal: false,
      showLabel: true,
      digits: 2,
      egldLabel: MAINNET_EGLD_LABEL
    };

    const component = await renderComponent(props);

    expect(decimalsSelector(component)).toBe(undefined);
  });

  it('should show symbol', async () => {
    const props = {
      value: '9000000000000000000000000',
      showLastNonZeroDecimal: false,
      showLabel: true,
      digits: 2,
      egldLabel: MAINNET_EGLD_LABEL
    };

    const component = await renderComponent(props);
    expect(symbolSelector(component)).toBe(1);
  });

  it('should not show symbol', async () => {
    const props = {
      value: '9000000000000000000000000',
      showLastNonZeroDecimal: false,
      showLabel: false,
      digits: 2,
      egldLabel: MAINNET_EGLD_LABEL
    };

    const component = await renderComponent(props);
    expect(symbolSelector(component)).toBe(0);
  });
});
