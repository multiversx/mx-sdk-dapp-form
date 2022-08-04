import { waitFor } from '@testing-library/react';
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
});
