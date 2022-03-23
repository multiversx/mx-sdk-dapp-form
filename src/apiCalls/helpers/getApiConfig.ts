import { networkSelector } from 'redux/selectors';
import { store } from 'redux/store';

export function getApiConfig() {
  const { apiAddress, apiTimeout } = networkSelector(store.getState());
  return { baseURL: apiAddress, timeout: apiTimeout };
}
