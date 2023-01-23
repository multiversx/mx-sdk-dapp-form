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
      expect(feeInFiat.textContent).toBe('(≈ $0.0029)');
    });
  });
  test('data field over 300 character error for ledger app version 1.0.10', async () => {
    const data = {
      target: {
        value: new Array(300 + 2).join('0') // creates a 301 characters long string
      }
    };

    const methods = renderForm({
      ledger: {
        ledgerDataActive: true,
        version: '1.0.8'
      }
    });

    const input = await methods.findByTestId('data');
    fireEvent.change(input, data);
    fireEvent.blur(input);

    const dataError = await methods.findByTestId('dataError');
    expect(dataError.textContent).toBe(
      'Data too long. You need at least MultiversX app version 1.0.11. Update MultiversX app to continue'
    );
  });
});
