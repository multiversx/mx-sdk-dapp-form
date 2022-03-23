import axios from 'axios';
import { getApiConfig } from 'apiCalls/helpers';

type ScamInfoType = {
  scamInfo?: {
    type: string;
    info: string;
  };
  code: string;
};

export async function checkScamAddress(addressToVerify: string) {
  const { data } = await axios.get<ScamInfoType>(
    `/accounts/${addressToVerify}`,
    getApiConfig()
  );
  return data;
}
