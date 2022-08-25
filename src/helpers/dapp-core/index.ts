import { calculateFeeLimit } from '@elrondnetwork/dapp-core/utils/operations/calculateFeeLimit';
import { formatAmount } from '@elrondnetwork/dapp-core/utils/operations/formatAmount';
import { getUsdValue as usdValue } from '@elrondnetwork/dapp-core/utils/operations/getUsdValue';

const denominate = formatAmount;
export { denominate, usdValue, calculateFeeLimit };
