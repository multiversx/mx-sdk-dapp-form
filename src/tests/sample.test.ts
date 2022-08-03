import { addressIsValid } from '@elrondnetwork/dapp-core/utils/account/addressIsValid';

test('func 2', async () => {
  const isValid = addressIsValid(
    'erd1qqqqqqqqqqqqqpgqxwakt2g7u9atsnr03gqcgmhcv38pt7mkd94q6shuwt'
  );
  expect(isValid).toBe(true);
});
