import { renderForm } from 'tests/helpers/renderForm';
import userEvent from '@testing-library/user-event';
import { sleep } from 'tests/helpers';

describe('GasLimit field', () => {
  it('should not allow exponential gasLimit', async () => {
    const { findByLabelText } = renderForm();

    const input = await findByLabelText('Gas Limit');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: '1e20' } };

    await userEvent.clear(processedInput);
    await userEvent.type(processedInput, data.target.value);
    await userEvent.tab();
    await sleep();

    expect(processedInput.value).toMatch('1');
  });
});
