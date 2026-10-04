export type ActionType =
  | "BUILD"
  | "UPGRADE"
  | "MARKET"
  | "SELL"
  | "DEFEND"
  | "PARTNER"
  | "MONITOR"
  | "DEFER";

export type Status = "Proposed" | "Review" | "Approved" | "Active" | "Monitoring";

export interface Neighbourhood {
  id: string;
  name: string;
  action: ActionType;
  status: Status;
  score: number;
  confidence: number;
  households: number;
  plannedHomes: number;
  addressableHouseholds: number;
  revenue: number;
  investment: number;
  payback: number;
  growth: number;
  network: number;
  competitive: number;
  penetration: number;
  internetOpportunity: number;
  wirelessOpportunity: number;
  mobileAttach: number;
  capitalEfficiency: number;
  churnExposure: number;
  mduOpportunity: number;
  x: number;
  y: number;
  reasons: string[];
}

export interface MarketSignal {
  id: number;
  title: string;
  category: string;
  geography: string;
  confidence: number;
  recency: string;
  importance: "Critical" | "High" | "Medium";
  product: string;
  agent: string;
  kind: "Opportunity" | "Risk";
  source: "Internal" | "Public" | "Licensed" | "Simulated";
  why: string;
  action: string;
  privacy: string;
}

export interface Agent {
  name: string;
  shortName: string;
  task: string;
  confidence: number;
  data: string;
  output: string;
}

export interface Scenario {
  id: string;
  name: string;
  action: string;
  investment: number;
  revenue: number;
  payback: number;
  customers: number;
  risk: string;
  confidence: number;
}

export interface FinancialAssumptions {
  adoption: number;
  internetArpu: number;
  mobileAttach: number;
  wifiAttach: number;
  capital: number;
  years: number;
  margin: number;
  competitiveIntensity: number;
  buildRisk: number;
}
