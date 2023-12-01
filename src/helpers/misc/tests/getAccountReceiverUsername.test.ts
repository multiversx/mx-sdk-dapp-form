import { LoginMethodsEnum } from '@multiversx/sdk-dapp/types';
import * as fetcher from '../../../apiCalls/account/getAccountByUsername';
import { getAccountReceiverUsername } from '../getAccountReceiverUsername';

const commonValues = {
  address: 'erd1..',
  balance: '0',
  nonce: 0,
  providerType: LoginMethodsEnum.extension
};

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('getAccountReceiverUsername tests', () => {
  test('Should swap initial value if username is found', async () => {
    jest.spyOn(fetcher, 'getAccountByUsername').mockResolvedValue({
      ...commonValues,
      username: 'herotag.elrond'
    });
    const receiverUsername = await getAccountReceiverUsername({
      rawReceiverUsername: 'Sample: #herotag',
      receiverUsername: 'Sample: #herotag'
    });
    expect(receiverUsername).toBe('herotag.elrond');
  });
  test('Should remove initial value if account is not found', async () => {
    jest.spyOn(fetcher, 'getAccountByUsername').mockResolvedValue(null);
    const receiverUsername = await getAccountReceiverUsername({
      rawReceiverUsername: 'Sample: #herotag',
      receiverUsername: 'Sample: #herotag'
    });
    expect(receiverUsername).toBe(undefined);
  });
  test('Should keep same value if account assets do not differ from defined username', async () => {
    jest.spyOn(fetcher, 'getAccountByUsername').mockResolvedValue({
      ...commonValues,
      username: 'herotag.elrond'
    });
    const receiverUsername = await getAccountReceiverUsername({
      rawReceiverUsername: 'herotag.elrond',
      receiverUsername: 'herotag'
    });
    expect(receiverUsername).toBe('herotag.elrond');
  });
});
