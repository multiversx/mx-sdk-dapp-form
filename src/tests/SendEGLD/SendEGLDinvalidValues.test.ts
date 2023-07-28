import { fireEvent } from '@testing-library/react';
import { renderForm } from 'tests/helpers/renderForm';
import { ValuesEnum } from 'types/form';

describe('EGLD Amount field', () => {
  it('should not be explicit positive', async () => {
    const { findByTestId } = renderForm();
    const input: any = await findByTestId(ValuesEnum.amount);
    const invalidValues = {
      '+1': '1',
      '1e2': '12',
      '0x1': '1',
      '1,2': '12'
    };
    for (const value of Object.keys(invalidValues)) {
      const data = { target: { value } };
      fireEvent.change(input, data);
      fireEvent.blur(input);
      const result = invalidValues[value];
      expect(input.value).toBe(result);
    }
  });
});
