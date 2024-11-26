import { fireEvent, waitFor } from '@testing-library/react';
import { testAddress, testNetwork } from '__mocks__';
import { rest, server, mockResponse } from '__mocks__/server';
import { renderForm } from 'tests/helpers/renderForm';

describe('Receiver field', () => {
  test('Receiver field should not be empty', async () => {
    const { findByTestId, queryByText } = renderForm();

    const data = { target: { value: '' } };
    const receiverInput = await findByTestId('receiver');
    const processedReceiverInput = receiverInput as HTMLInputElement;

    fireEvent.change(processedReceiverInput, data);
    fireEvent.blur(processedReceiverInput);

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
    fireEvent.change(processedReceiverInput, data);
    fireEvent.blur(processedReceiverInput);

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

    fireEvent.change(processedReceiverInput, data);
    fireEvent.blur(processedReceiverInput);
    expect(processedReceiverInput.value).toBe('alice');

    await waitFor(async () => {
      const receiverUsernameAddress = await findByTestId(
        'receiverUsernameAddress'
      );
      expect(receiverUsernameAddress?.innerHTML).toBeDefined();
    });
  });
});
