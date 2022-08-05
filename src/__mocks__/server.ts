import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { testAddress, testNetwork } from './accountConfig';

const handlers = [
  ...['tokens', 'nfts', 'sfts'].map((el) => {
    return rest.get(
      `${testNetwork.apiAddress}/accounts/${testAddress}/${el}`,
      (req, res, ctx) => {
        if (false) console.log(req); // avoid eslint unused build error
        return res(ctx.status(200), ctx.json([]));
      }
    );
  }),
  rest.get(`${testNetwork.apiAddress}/economics`, (req, res, ctx) => {
    if (false) console.log(req);
    return res(
      ctx.status(200),
      ctx.json({
        totalSupply: 20431908,
        circulatingSupply: 19101908,
        staked: 5562989,
        price: 58.14,
        marketCap: 1110584931,
        apr: 0.350951,
        topUpApr: 0.150087,
        baseApr: 0.413132
      })
    );
  }),
  rest.get(`${testNetwork.apiAddress}/transactions`, (req, res, ctx) => {
    if (false) console.log(req);
    return res(ctx.status(200), ctx.json([]));
  })
];

// This configures a request mocking server with the given request handlers.
const server = setupServer(...handlers);

export { server, rest };
