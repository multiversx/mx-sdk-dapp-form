import axios from 'axios';
import { ApiPropsType } from 'apiCalls/types';

export type ScamInfoType = {
  scamInfo?: {
    type: string;
    info: string;
  };
  code: string;
};

export const checkScamAddress =
  (props: ApiPropsType) => async (addressToVerify: string) => {
    const { data } = await axios.get<ScamInfoType>(
      `/accounts/${addressToVerify}`,
      props
    );
    return data;
  };
