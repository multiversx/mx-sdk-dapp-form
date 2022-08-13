import { fireEvent, waitFor } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { testAddress, testNetwork, testReceiver } from '__mocks__';
import { rest, server, mockResponse } from '__mocks__/server';
import {
  formConfiguration,
  beforeAll as beginAll,
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

describe('Send tokens', () => {
  beforeEach(() => {
    server.use(
      rest.get(
        `${testNetwork.apiAddress}/accounts/${testAddress}/nfts/${metaToken.identifier}`,
        mockResponse(metaToken)
      )
    );
    server.use(
      rest.get(
        `${testNetwork.apiAddress}/accounts/${testAddress}/nfts`,
        mockResponse([metaToken])
      )
    );
    server.use(
      rest.get(
        `${testNetwork.apiAddress}/accounts/${testReceiver}`,
        mockResponse({})
      )
    );
  });
  test.only('MetaEsdt send', async () => {
    const methods = beforAllTokens();

    // fill in receiver
    const input = await methods.findByTestId('destinationAddress');

    const data = { target: { value: testReceiver } };
    fireEvent.change(input, data);

    // confirm metaEsdt token is in list
    const selectInput = await methods.findByLabelText('Token');
    selectEvent.openMenu(selectInput);
    const metaTokenOption = await methods.findByTestId(
      `${metaToken.identifier}-option`
    );
    expect(metaTokenOption.innerHTML).toBeDefined();

    // select metaEsdt token
    selectEvent.select(selectInput, metaToken.name);

    const tokenId: any = methods.container.querySelector(
      'input[name="tokenId"]'
    );

    await waitFor(() => {
      expect(tokenId.value).toBe(metaToken.identifier);
    });

    // check available
    const available = methods.getByTestId(`available-${metaToken.identifier}`);
    expect(available.innerHTML).toBe('Available 10000');

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

    sendAndConfirmTest({ methods })({
      amount: '10.0000',
      fee: '0.000239185'
    });
  });
});
