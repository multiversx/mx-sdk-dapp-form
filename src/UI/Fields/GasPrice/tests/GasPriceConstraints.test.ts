import { waitFor } from '@testing-library/react';

import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types';
import userEvent from '@testing-library/user-event';
import { sleep } from 'tests/helpers';

describe('GasPrice field', () => {
  it('should be below given threshold', async () => {
    const { findByLabelText, findByTestId } = renderForm();

    const input = await findByLabelText('Gas Price (per Gas Unit)');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: '0.0000001' } };

    await userEvent.clear(processedInput);
    await userEvent.type(processedInput, data.target.value);
    await userEvent.tab();
    await sleep();

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

    await userEvent.clear(processedInput);
    await userEvent.type(processedInput, data.target.value);
    await userEvent.tab();
    await sleep();

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

    await userEvent.clear(processedInput);
    await userEvent.type(processedInput, data.target.value);
    await userEvent.tab();
    await sleep();

    expect(processedInput.value).toMatch('1');
  });

  it('should not allow explicit positive gasPrice', async () => {
    const { findByLabelText } = renderForm();

    const input = await findByLabelText('Gas Price (per Gas Unit)');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: '+1' } };

    await userEvent.clear(processedInput);
    await userEvent.type(processedInput, data.target.value);
    await userEvent.tab();
    await sleep();

    expect(processedInput.value).toMatch('1');
  });

  it('should not allow negative gasPrice', async () => {
    const { findByLabelText } = renderForm();

    const input = await findByLabelText('Gas Price (per Gas Unit)');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: '-1' } };

    await userEvent.clear(processedInput);
    await userEvent.type(processedInput, data.target.value);
    await userEvent.tab();
    await sleep();

    expect(processedInput.value).toMatch('1');
  });

  it('should not be string', async () => {
    const { findByLabelText } = renderForm();

    const input = await findByLabelText('Gas Price (per Gas Unit)');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: 'string' } };

    await userEvent.clear(processedInput);
    await userEvent.type(processedInput, data.target.value);
    await userEvent.tab();
    await sleep();

    expect(processedInput.value).toMatch('');
  });
});
