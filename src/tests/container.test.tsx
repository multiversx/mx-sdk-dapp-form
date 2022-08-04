import { act, waitFor } from '@testing-library/react';
import { beforeAll } from './helpers/beforeAll';

describe('SendFormContainer', () => {
  test('renders SendFormContainer component', async () => {
    await act(async () => {
      const { findByTestId } = beforeAll();

      waitFor(async () => {
        const span = await findByTestId('span');

        expect(span.innerHTML).toBe('12');
      });
    });
  });
});
