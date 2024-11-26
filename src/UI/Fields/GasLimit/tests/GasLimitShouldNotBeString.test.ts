import { fireEvent } from '@testing-library/react';

import { renderForm } from 'tests/helpers/renderForm';

describe('GasLimit field', () => {
  it('should not be string', async () => {
    const { findByLabelText } = renderForm();

    const input = await findByLabelText('Gas Limit');
    const processedInput = input as HTMLInputElement;
    const data = { target: { value: 'string' } };

    fireEvent.change(processedInput, data);
    fireEvent.blur(processedInput);

    expect(processedInput.value).toMatch('');
  });
});
