import { fireEvent } from '@testing-library/react';

import { renderForm } from 'tests/helpers/renderForm';

describe('GasPrice field', () => {
  it('should not allow negative gasPrice', async () => {
    const { findByLabelText } = renderForm();

    const input = await findByLabelText('Gas Price (per Gas Unit)');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: '-1' } };

    fireEvent.change(processedInput, data);
    fireEvent.blur(processedInput);

    expect(processedInput.value).toMatch('1');
  });
});
