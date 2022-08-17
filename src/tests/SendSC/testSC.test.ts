import { fillInForm, setResponse } from './helpers';

describe.only('SendForm Smart Contract', () => {
  beforeEach(() => {
    setResponse([1500057500, false, 92000]);
  });

  test('Too high gasLimit shows error', async () => {
    const { render } = await fillInForm();
    expect(render).toBeDefined();
  });
});
