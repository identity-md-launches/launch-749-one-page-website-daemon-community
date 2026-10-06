import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONTRACT, IMD } from '../src/constants';
import { EMPTY, readMarket, usd } from '../src/market';

const pair = { chainId: 'ethereum', baseToken: { address: CONTRACT }, quoteToken: { address: IMD }, priceUsd: '0.000042', marketCap: 42000, liquidity: { usd: 8400 }, volume: { h24: 1200 } };
test('selects the true Ethereum DAEMON / IMD pool, choosing the most liquid match', () => {
  const wrong = { ...pair, quoteToken: { address: '0xwrong', symbol: 'IMD' }, liquidity: { usd: 90000 } };
  assert.equal(readMarket({ pairs: [wrong, { ...pair, liquidity: { usd: 1 } }, pair] })?.liquidity, 8400);
  assert.equal(readMarket({ pairs: [{ ...pair, chainId: 'base' }] }), null);
  assert.equal(readMarket({ pairs: [{ ...pair, baseToken: { address: IMD } }] }), null);
});
test('handles missing, empty, malformed and partial data without inventing figures', () => {
  for (const value of [null, {}, { pairs: null }, { pairs: [] }, { pairs: [null, 2, 'bad'] }]) assert.equal(readMarket(value), null);
  assert.deepEqual(readMarket({ pairs: [{ ...pair, priceUsd: '', marketCap: null, liquidity: null, volume: { h24: -1 } }] }), EMPTY);
  assert.equal(readMarket({ pairs: [{ ...pair, marketCap: 0 }] })?.marketCap, 0);
});
test('USD formatting preserves zero, small prices and missing values', () => {
  assert.equal(usd(null), '—');
  assert.equal(usd(0), '$0.00');
  assert.equal(usd(0.000042, true), '$0.000042');
  assert.equal(usd(1e-10, true), '$1.000e-10');
  assert.equal(usd(1_000_000), '$1.00M');
});
