import axios from 'axios';
import { ApiConfigType, getApiConfig } from 'apiCalls/apiConfig';

export type ScamInfoType = {
  scamInfo?: {
    type: string;
    info: string;
  };
  code: string;
};

export async function checkScamAddress(
  addressToVerify: string,
  apiConfig?: ApiConfigType
) {
  const config = apiConfig || (await getApiConfig());
  const { data } = await axios.get<ScamInfoType>(
    `/accounts/${addressToVerify}`,
    config
  );

  return data;
}
