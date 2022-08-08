import { fireEvent, waitFor } from '@testing-library/react';
import { denominateSelector } from 'tests/helpers';
import { beforeAll } from 'tests/helpers/beforeAll';

describe('Data field tests', () => {
  test('data changes transaction fee', async () => {
    const data = { target: { value: 'four' } };

    const methods = beforeAll();

    const feeLimit = await methods.findByTestId('feeLimit');

    expect(denominateSelector(feeLimit).intAmount).toBe('0');

    const input = methods.getByTestId('data');
    fireEvent.change(input, data);

    const gasInput: any = methods.getByTestId('gasLimit');
    expect(gasInput.value).toBe('56000');

    expect(denominateSelector(feeLimit).intAmount).toBe('0');
    expect(denominateSelector(feeLimit).decimalAmount).toBe('.000056');

    const feeValue = methods.getByTestId('feeInFiat');

    await waitFor(() => {
      expect(feeValue.textContent).toBe('≈ $0.0029');
    });
  });
});
