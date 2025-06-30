import {
  DefaultBodyType,
  PathParams,
  rest,
  RestContext,
  RestRequest,
  RestHandler,
  ResponseResolver
} from 'msw';
import { setupServer, SetupServer } from 'msw/node';
import { testAddress, testNetwork, testReceiver } from './accountConfig';

export const mockResponse = <T extends DefaultBodyType>(
  body: T
): ResponseResolver<
  RestRequest<never, PathParams<string>>,
  RestContext,
  DefaultBodyType
> => {
  return (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(body));
  };
};

const handlers: RestHandler[] = [
  ...['tokens', 'nfts', 'sfts'].map((el) => {
    return rest.get(
      `${testNetwork.apiAddress}/accounts/${testAddress}/${el}`,
      mockResponse([])
    );
  }),
  rest.get(
    `${testNetwork.apiAddress}/accounts/${testReceiver}`,
    mockResponse({})
  ),
  rest.get(
    `${testNetwork.apiAddress}/economics`,
    mockResponse({
      totalSupply: 20431908,
      circulatingSupply: 19101908,
      staked: 5562989,
      price: 58.14,
      marketCap: 1110584931,
      apr: 0.350951,
      topUpApr: 0.150087,
      baseApr: 0.413132
    })
  ),
  rest.get(`${testNetwork.apiAddress}/transactions`, mockResponse([]))
];

// This configures a request mocking server with the given request handlers.
const server: SetupServer = setupServer(...handlers);

export { server, rest };
