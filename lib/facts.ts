/** Figures copied from Circle’s transparency page. That page shows billions, not cents. */

export const circulation = {
  asOf: "9 November 2026",
  total: 68_930_000_000,
  href: "https://www.circle.com/transparency",
} as const;

export const reserves = {
  asOf: "9 November 2026",
  total: 69_050_000_000,
  otherBankDeposits: 680_000_000,
  systemicallyImportantDeposits: 8_480_000_000,
  overnightReverseRepo: 35_760_000_000,
  shortTreasuries: 24_130_000_000,
  href: "https://www.circle.com/transparency",
} as const;

export const ethereumUsdc = {
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  decimals: 6,
  href: "https://developers.circle.com/stablecoins/usdc-contract-addresses",
  explorer: "https://etherscan.io/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
} as const;

export function billions(amount: number): string {
  return `$${(amount / 1_000_000_000).toFixed(2)} billion`;
}

export const reserveCoverage = reserves.total - circulation.total;
