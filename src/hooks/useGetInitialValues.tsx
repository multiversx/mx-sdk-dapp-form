import { useState, useEffect } from 'react';
import { SendFormContainerPropsType } from 'containers/SendFormContainer';
import { PartialNftType, PartialTokenType } from 'types';
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
  nft?: PartialNftType;
  gasLimitCostError?: SendFormContainerPropsType['initGasLimitError'];
  computedTokens: PartialTokenType[];
  computedTokenId: string;
  tokenFound: boolean;
}

export function useGetInitialValues(props: GetInitialValuesType) {
  const [state, setState] = useState<GetInitialValuesReturnType>();

  async function getValues() {
    const values = await getInitialValues(props);
    setState(values);
  }

  useEffect(() => {
    getValues();
  }, []);

  return state;
}
