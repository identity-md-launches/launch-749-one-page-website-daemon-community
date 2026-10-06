import { CONTRACT, IMD } from './constants';

export type Metrics = { price: number | null; marketCap: number | null; liquidity: number | null; volume: number | null };
export const EMPTY: Metrics = { price: null, marketCap: null, liquidity: null, volume: null };

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};
}
function amount(value: unknown): number | null {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

// Verify addresses, not just symbols: any token can call itself IMD.
// If multiple matching pools exist, use the most liquid one deterministically.
export function readMarket(data: unknown): Metrics | null {
  const pairs = record(data).pairs;
  if (!Array.isArray(pairs)) return null;
  const matches = pairs.map(record).filter(pair =>
    pair.chainId === 'ethereum' &&
    String(record(pair.baseToken).address).toLowerCase() === CONTRACT &&
    String(record(pair.quoteToken).address).toLowerCase() === IMD,
  ).sort((a, b) => (amount(record(b.liquidity).usd) ?? 0) - (amount(record(a.liquidity).usd) ?? 0));
  if (!matches.length) return null;
  const pair = matches[0];
  return {
    price: amount(pair.priceUsd),
    marketCap: amount(pair.marketCap),
    liquidity: amount(record(pair.liquidity).usd),
    volume: amount(record(pair.volume).h24),
  };
}

export function usd(value: number | null, price = false): string {
  if (value === null) return '—';
  if (price && value > 0 && value < 0.00000001) return `$${value.toExponential(3)}`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    maximumFractionDigits: price && value < 1 ? 8 : 2,
    minimumFractionDigits: 2,
    ...(value >= 1_000_000 ? { notation: 'compact' as const } : {}),
  }).format(value);
}
