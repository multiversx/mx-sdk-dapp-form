import { waitFor } from '@testing-library/react';
import { testAddress, testNetwork } from '__mocks__';
import { rest, server, mockResponse } from '__mocks__/server';
import { renderForm } from 'tests/helpers/renderForm';
import userEvent from '@testing-library/user-event';
import { sleep } from 'tests/helpers';

jest.mock('../../../../assets/icons/mx-icon-simple.svg', () => ({
  __esModule: true,
  default: () => 'svg'
}));

describe('Receiver field', () => {
  test('Receiver field should not be empty', async () => {
    const { findByTestId, queryByText } = renderForm();

    const data = { target: { value: '' } };
    const receiverInput = await findByTestId('receiver');
    const processedReceiverInput = receiverInput as HTMLInputElement;

    await userEvent.clear(processedReceiverInput);
    await userEvent.type(processedReceiverInput, data.target.value);
    await userEvent.tab();

    await waitFor(() => {
      expect(processedReceiverInput.value).toBe('');
      const req = queryByText('Required');
      expect(req?.innerHTML).toBe('Required');
    });
  });

  it('should validate address', async () => {
    const { findByTestId } = renderForm();
    const receiverInput = await findByTestId('receiver');
    const processedReceiverInput = receiverInput as HTMLInputElement;

    const data = { target: { value: '123' } };
    await userEvent.clear(processedReceiverInput);
    await userEvent.type(processedReceiverInput, data.target.value);
    await userEvent.tab();
    await waitFor(async () => {
      const receiverUsernameError = await findByTestId('receiverUsernameError');
      expect(receiverUsernameError?.innerHTML).toBe('Invalid herotag');
    });
  });
});

describe('Receiver username found', () => {
  beforeEach(() => {
    server.use(
      rest.get(
        `${testNetwork.apiAddress}/usernames/alice`,
        mockResponse({
          address: testAddress,
          username: 'alice.elrond'
        })
      )
    );
  });
  test('Receiver field should fetch address by username', async () => {
    const { findByTestId } = renderForm();

    const data = { target: { value: 'alice' } };
    const receiverInput = await findByTestId('receiver');
    const processedReceiverInput = receiverInput as HTMLInputElement;

    await userEvent.clear(processedReceiverInput);
    await userEvent.type(processedReceiverInput, data.target.value);
    await userEvent.tab();
    await sleep();
    expect(processedReceiverInput.value).toBe('alice');

    const receiverUsernameAddress = await findByTestId(
      'receiverUsernameAddress'
    );
    expect(receiverUsernameAddress?.innerHTML).toBeDefined();
  });
});
