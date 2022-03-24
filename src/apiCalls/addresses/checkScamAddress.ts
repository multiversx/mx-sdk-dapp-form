import axios from 'axios';
import { getApiConfig } from 'apiCalls/apiConfig';

export type ScamInfoType = {
  scamInfo?: {
    type: string;
    info: string;
  };
  code: string;
};

export async function checkScamAddress(addressToVerify: string) {
  const apiConfig = await getApiConfig();
  const { data } = await axios.get<ScamInfoType>(
    `/accounts/${addressToVerify}`,
    apiConfig
  );
  return data;
}
