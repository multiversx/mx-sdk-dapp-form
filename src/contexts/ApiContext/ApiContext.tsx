import React, { useContext } from 'react';

export interface ApiContextPropsType {
  baseURL: string;
  timeout?: number;
}

interface ApiContextProviderPropsType {
  value: ApiContextPropsType;
  children: React.ReactNode;
}

export const ApiContext = React.createContext({} as ApiContextPropsType);

export function ApiContextProvider({
  value,
  children
}: ApiContextProviderPropsType) {
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApiContext() {
  return useContext(ApiContext);
}
