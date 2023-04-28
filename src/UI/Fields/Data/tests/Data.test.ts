import { fireEvent, waitFor } from '@testing-library/react';
import { formattedAmountSelector } from 'tests/helpers';
import { renderForm } from 'tests/helpers';

describe('Data field tests', () => {
  test('data changes transaction fee', async () => {
    const data = { target: { value: 'four' } };

    const methods = renderForm();

    const feeLimit = await methods.findByTestId('feeLimit');

    expect(formattedAmountSelector(feeLimit).intAmount).toBe('0');

    const input = methods.getByTestId('data');

    fireEvent.change(input, data);

    const gasInput: any = methods.getByTestId('gasLimit');
    expect(gasInput.value).toBe('56000');

    expect(formattedAmountSelector(feeLimit).intAmount).toBe('0');
    expect(formattedAmountSelector(feeLimit).decimalAmount).toBe('.000056');

    // prevent async effects error logging
    const feeInFiat = await methods.findByTestId('feeInFiat');
    await waitFor(() => {
      expect(feeInFiat.textContent).toBe('(≈ $0.0033)');
    });
  });
});
