import type { FinancialAssumptions } from "./types";

export const defaultAssumptions: FinancialAssumptions = {
  adoption: 38,
  internetArpu: 92,
  mobileAttach: 57,
  wifiAttach: 38,
  capital: 4.7,
  years: 5,
  margin: 48,
  competitiveIntensity: 72,
  buildRisk: 18,
};

export function calculateBusinessCase(a: FinancialAssumptions) {
  const addressable = 4150;
  const internetCustomers = Math.round(addressable * (a.adoption / 100));
  const mobileLines = Math.round(internetCustomers * (a.mobileAttach / 100) * 1.75);
  const wifiCustomers = Math.round(internetCustomers * (a.wifiAttach / 100));
  const internetRevenue = internetCustomers * a.internetArpu * 12 * a.years;
  const mobileRevenue = mobileLines * 58 * 12 * a.years;
  const wifiRevenue = wifiCustomers * 15 * 12 * a.years;
  const otherRevenue = internetCustomers * 8 * 12 * a.years;
  const riskFactor = 1 - a.buildRisk / 200;
  const totalRevenue =
    (internetRevenue + mobileRevenue + wifiRevenue + otherRevenue) * riskFactor;
  const investment = a.capital * 1_000_000;
  const ratio = totalRevenue / investment;
  const monthlyContribution = (totalRevenue / (a.years * 12)) * (a.margin / 100);
  const payback = investment / monthlyContribution;

  return {
    internetCustomers,
    mobileLines,
    wifiCustomers,
    totalRevenue,
    ratio,
    payback,
    investment,
  };
}
