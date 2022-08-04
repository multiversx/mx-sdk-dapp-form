import * as React from 'react';
import { NftType, TokenType } from 'types';
import { getInitialValues } from './getInitialValues';
import { GetInitialValuesType } from './getInitialValues/types';

export interface GetInitialValuesReturnType {
  initialValues: {
    receiver: string;
    amount: string;
    tokenId: string;
    gasLimit: string;
    gasPrice: string;
    data: string;
  };
  nft?: NftType;
  gasLimitCostError: string | null;
  computedTokens: TokenType[];
  computedTokenId: string;
  tokenFound: boolean;
}

export function useGetInitialValues(props: GetInitialValuesType) {
  const [state, setState] = React.useState<GetInitialValuesReturnType>();

  async function getValues() {
    const values = await getInitialValues(props);
    setState(values);
  }

  React.useEffect(() => {
    getValues();
  }, []);

  return state;
}

export default useGetInitialValues;
