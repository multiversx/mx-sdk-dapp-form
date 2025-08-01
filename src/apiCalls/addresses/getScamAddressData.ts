import axios from 'axios';
import { ApiConfigType, getApiConfig } from 'apiCalls/apiConfig';

export type ScamInfoType = {
  scamInfo?: {
    type: string;
    info: string;
  };
  code: string;
};

export async function getScamAddressData(
  addressToVerify: string,
  apiConfig?: ApiConfigType
) {
  const config = apiConfig || (await getApiConfig());

  if (!config) {
    return null;
  }

  const { data } = await axios.get<ScamInfoType>(
    `/accounts/${addressToVerify}`,
    config
  );

  return data;
}
