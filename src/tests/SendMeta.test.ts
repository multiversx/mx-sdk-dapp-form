import { fireEvent, waitFor } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { testAddress, testNetwork, testReceiver } from '__mocks__';
import { rest, server, mockResponse } from '__mocks__/server';
import {
  formConfiguration,
  renderForm as beginAll,
  sendAndConfirmTest
} from 'tests/helpers';

const beforAllTokens = (balance?: string) =>
  beginAll({
    formConfigValues: {
      ...formConfiguration
    },
    ...(balance ? { balance } : {})
  });

const metaToken = {
  identifier: 'MT1-ff89d3-01',
  collection: 'MT1-ff89d3',
  nonce: 1,
  type: 'MetaESDT',
  name: 'MetaOne',
  creator: 'erd1wh9c0sjr2xn8hzf02lwwcr4jk2s84tat9ud2kaq6zr7xzpvl9l5q8awmex',
  isWhitelistedStorage: false,
  balance: '10000000000000000000000',
  decimals: 18,
  ticker: 'MT1-ff89d3'
};

const metaFarm = {
  collection: 'MT1-ff89d3',
  type: 'MetaESDT',
  name: 'LockedLPStaked',
  ticker: 'LKFARM',
  owner: testReceiver,
  roles: [
    {
      address: testReceiver,
      canTransfer: true
    }
  ],
  canTransfer: false
};

const fakeReceiver =
  'erd1qqqqqqqqqqqqqpgqawujux7w60sjhm8xdx3n0ed8v9h7kpqu2jpsecw6ek';

describe('Send Meta ESDT', () => {
  beforeEach(() => {
    server.use(
      rest.get(
        `${testNetwork.apiAddress}/accounts/${testAddress}/nfts/${metaToken.identifier}`,
        mockResponse(metaToken)
      )
    );
    server.use(
      rest.get(
        `${testNetwork.apiAddress}/collections/${metaFarm.collection}`,
        mockResponse(metaFarm)
      )
    );
    server.use(
      rest.get(
        `${testNetwork.apiAddress}/accounts/${testAddress}/tokens`,
        mockResponse([metaToken])
      )
    );

    server.use(
      rest.get(
        `${testNetwork.apiAddress}/accounts/${fakeReceiver}`,
        mockResponse({})
      )
    );
    server.use(
      rest.get(
        `${testNetwork.apiAddress}/accounts/${testReceiver}`,
        mockResponse({})
      )
    );
    server.use(
      rest.post(`${testNetwork.apiAddress}/transaction/cost`, mockResponse({}))
    );
  });
  test('MetaEsdt send', async () => {
    const methods = beforAllTokens();

    // confirm metaEsdt token is in list
    const selectInput = await methods.findByLabelText('Token');
    fireEvent.focus(selectInput);
    selectEvent.openMenu(selectInput);
    const metaTokenOption = await methods.findByTestId(
      `${metaToken.identifier}-option`
    );
    expect(metaTokenOption.innerHTML).toBeDefined();

    // select metaEsdt token
    selectEvent.select(selectInput, metaToken.ticker);

    const tokenId: any = methods.container.querySelector(
      'input[name="tokenId"]'
    );

    await waitFor(() => {
      expect(tokenId.value).toBe(metaToken.identifier);
    });

    const canTransferWarning = await methods.findByTestId('canTransferWarning');
    expect(canTransferWarning.textContent).toContain('Warning');

    // fill in receiver
    const receiver = await methods.findByTestId('receiver');

    // expect receiver to be forbidden
    fireEvent.change(receiver, { target: { value: fakeReceiver } });
    fireEvent.blur(receiver, { target: { value: fakeReceiver } });

    await waitFor(async () => {
      const receiverError = await methods.findByTestId('receiverError');
      expect(receiverError.textContent).toBe('Receiver not allowed');
    });

    // fill in allowed receiver
    fireEvent.change(receiver, { target: { value: testReceiver } });

    // check available
    const available = methods.getByTestId(`available-${metaToken.identifier}`);
    expect(available.textContent).toBe('Available: 10,000 MT1-ff89d3');

    // fill in amount
    const amount: any = await methods.findByTestId('amount');
    fireEvent.change(amount, { target: { value: '10' } });
    fireEvent.blur(amount, { target: { value: '10' } });

    const dataInput: any = methods.getByTestId('data');

    // check data input disabled
    expect(dataInput.disabled).toBeTruthy();

    const dataString =
      'ESDTNFTTransfer@4d54312d666638396433@01@8ac7230489e80000@000000000000000005000e8a594d1c9b52073fcd3c856c87986045c85f568b98';

    await waitFor(() => {
      expect(dataInput.value).toBe(dataString);
    });

    const gasLimit: any = methods.getByTestId('gasLimit');
    expect(gasLimit.value).toBe('1000000');

    await sendAndConfirmTest({ methods })({
      amount: '10.0000',
      fee: '0.0000595'
    });
  });
});
