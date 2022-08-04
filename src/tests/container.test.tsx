import { fireEvent, waitFor } from '@testing-library/react';
import { beforeAll } from './helpers/beforeAll';

describe('SendFormContainer', () => {
  test('renders SendFormContainer component', async () => {
    const { findByTestId } = beforeAll();

    const loader = await findByTestId('loader');

    expect(loader).toBeDefined();

    waitFor(async () => {
      const span = await findByTestId('span');

      expect(span.innerHTML).toBe('12');
    });
  });
  test('Destination address should not be empty', async () => {
    const { findByTestId, queryByText } = beforeAll();

    const data = { target: { value: '' } };
    const input: any = await findByTestId('destinationAddress');

    fireEvent.change(input, data);
    fireEvent.blur(input);
    await waitFor(() => {
      expect(input.value).toBe('');
      const req = queryByText('Required');
      expect(req!.innerHTML).toBe('Required');
    });
  });
});
