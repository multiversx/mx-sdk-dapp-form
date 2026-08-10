import {
  DefaultBodyType,
  http,
  HttpResponse,
  HttpResponseResolver,
  RequestHandler
} from 'msw';
import { setupServer, SetupServer } from 'msw/node';
import { testAddress, testNetwork, testReceiver } from './accountConfig';

export const mockResponse =
  <T extends DefaultBodyType>(body: T): HttpResponseResolver =>
  () =>
    HttpResponse.json(body, { status: 200 });

const handlers: RequestHandler[] = [
  ...['tokens', 'nfts', 'sfts'].map((el) =>
    http.get(
      `${testNetwork.apiAddress}/accounts/${testAddress}/${el}`,
      mockResponse([])
    )
  ),
  http.get(
    `${testNetwork.apiAddress}/accounts/${testReceiver}`,
    mockResponse({})
  ),
  http.get(
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
  http.get(`${testNetwork.apiAddress}/transactions`, mockResponse([])),
  http.get(`${testNetwork.apiAddress}/usernames/:username`, () =>
    HttpResponse.json(
      { statusCode: 404, message: 'Not Found' },
      { status: 404 }
    )
  )
];

// This configures a request mocking server with the given request handlers.
const server: SetupServer = setupServer(...handlers);

export { server, http };
