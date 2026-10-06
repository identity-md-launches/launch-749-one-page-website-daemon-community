export const CONTRACT = '0x4a09888667f7bcf5ff990b213e6e09ac442e24f7';
export const IMD = '0xd34a99bc0f67ae1bbd63c660e6d0b0dd03e263b7';
export const CLAIM = '0x359f524d6fed5fd4001a104af32a2d2086c12e35';
export const API = `https://api.dexscreener.com/latest/dex/tokens/${CONTRACT}`;
export const LINKS = {
  buy: `https://app.uniswap.org/swap?chain=mainnet&inputCurrency=${IMD}&outputCurrency=${CONTRACT}`,
  chart: `https://dexscreener.com/ethereum/${CONTRACT}`,
  etherscan: `https://etherscan.io/token/${CONTRACT}`,
  source: 'https://github.com/identity-md-launches/launch-745-daemon',
  tokenJob: 'https://explorer.imd.fun/jobs/29511fc0-63b4-48ab-94fb-77c9dd799e9b',
  logoJob: 'https://explorer.imd.fun/jobs/2ed05e18-2bbd-4718-a4cf-0db840bb83d4',
};
