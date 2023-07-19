import { fireEvent, waitFor } from '@testing-library/react';
import { renderForm } from 'tests/helpers/renderForm';

describe('Receiver field', () => {
  test('Receiver field should not be empty', async () => {
    const { findByTestId, queryByText } = renderForm();

    const data = { target: { value: '' } };
    const input: any = await findByTestId('receiver');

    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      expect(input.value).toBe('');
      const req = queryByText('Required');
      expect(req?.innerHTML).toBe('Required');
    });
  });
  it('should validate address', async () => {
    const { findByTestId } = renderForm();
    const input: any = await findByTestId('receiver');
    const value = '123';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(async () => {
      const receiverUsernameError = await findByTestId('receiverUsernameError');
      expect(receiverUsernameError?.innerHTML).toBe('Invalid herotag');
    });
  });
});
