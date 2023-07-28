import { fireEvent, waitFor } from '@testing-library/react';
import { FormDataTestIdsEnum } from 'constants/formDataTestIds';
import { formattedAmountSelector } from 'tests/helpers';
import { renderForm } from 'tests/helpers';
import { ValuesEnum } from 'types/form';

describe('Data field tests', () => {
  test('data changes transaction fee', async () => {
    const data = { target: { value: 'four' } };

    const methods = renderForm();

    const feeLimit = await methods.findByTestId(FormDataTestIdsEnum.feeLimit);

    expect(formattedAmountSelector(feeLimit).intAmount).toBe('0');

    const input = methods.getByTestId(ValuesEnum.data);

    fireEvent.change(input, data);

    const gasInput: any = methods.getByTestId(ValuesEnum.gasLimit);
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
