import { fireEvent, waitFor } from '@testing-library/react';

import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types';

describe('GasPrice field', () => {
  it('should be below given threshold', async () => {
    const { findByLabelText, findByTestId } = renderForm();

    const input = await findByLabelText('Gas Price (per Gas Unit)');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: '0.0000001' } };

    fireEvent.change(processedInput, data);
    fireEvent.blur(processedInput);

    await waitFor(async () => {
      const errorMessage = await findByTestId(`${ValuesEnum.gasPrice}Error`);
      expect(errorMessage?.textContent).toBe(
        'Gas price must be lower or equal to 0.00000001'
      );
    });
  });

  it('should limit decimals under 18', async () => {
    const { findByLabelText, queryByText } = renderForm();

    const input = await findByLabelText('Gas Price (per Gas Unit)');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: '0.1234567891234567890' } };

    fireEvent.change(processedInput, data);
    fireEvent.blur(processedInput);

    await waitFor(() => {
      const req = queryByText('Maximum 18 decimals allowed');
      expect(req?.innerHTML).toBe('Maximum 18 decimals allowed');
    });
  });

  it('should not allow exponential gasPrice', async () => {
    const { findByLabelText } = renderForm();

    const input = await findByLabelText('Gas Price (per Gas Unit)');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: '1e20' } };

    fireEvent.change(processedInput, data);
    fireEvent.blur(processedInput);

    expect(processedInput.value).toMatch('1');
  });

  it('should not allow explicit positive gasPrice', async () => {
    const { findByLabelText } = renderForm();

    const input = await findByLabelText('Gas Price (per Gas Unit)');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: '+1' } };

    fireEvent.change(processedInput, data);
    fireEvent.blur(processedInput);

    expect(processedInput.value).toMatch('1');
  });

  it('should not allow negative gasPrice', async () => {
    const { findByLabelText } = renderForm();

    const input = await findByLabelText('Gas Price (per Gas Unit)');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: '-1' } };

    fireEvent.change(processedInput, data);
    fireEvent.blur(processedInput);

    expect(processedInput.value).toMatch('1');
  });

  it('should not be string', async () => {
    const { findByLabelText } = renderForm();

    const input = await findByLabelText('Gas Price (per Gas Unit)');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: 'string' } };

    fireEvent.change(processedInput, data);
    fireEvent.blur(processedInput);

    expect(processedInput.value).toMatch('');
  });
});
