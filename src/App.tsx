import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Database,
  FileSearch,
  Gauge,
  GitBranch,
  Home,
  Layers3,
  Lightbulb,
  Map,
  Menu,
  Moon,
  Network,
  Pause,
  Play,
  RefreshCw,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Link,
  NavLink,
  Navigate,
  Route as RouterRoute,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { calculateBusinessCase, defaultAssumptions } from "./calculations";
import {
  agents,
  disclaimer,
  neighbourhoods,
  productOpportunity,
  scenarios,
  signals,
  walkthrough,
  workflow,
  workstreams,
} from "./data";
import type {
  FinancialAssumptions,
  MarketSignal,
  Neighbourhood,
} from "./types";

const money = (value: number) => `$${value.toFixed(1)}M`;
const compact = new Intl.NumberFormat("en-CA", { notation: "compact" });

const navItems = [
  { path: "/", label: "Executive Dashboard", icon: Home },
  { path: "/signals", label: "Growth Signal Radar", icon: Activity },
  { path: "/map", label: "Market Opportunity Map", icon: Map },
  { path: "/neighbourhood", label: "Neighbourhood Deep Dive", icon: Building2 },
  { path: "/recommendation", label: "Agent Recommendation", icon: Sparkles },
  { path: "/plan", label: "Growth Plan", icon: ClipboardCheck },
  { path: "/outcomes", label: "Business Outcomes", icon: BarChart3 },
  { path: "/walkthrough", label: "Executive Walkthrough", icon: Play },
  { path: "/architecture", label: "Microsoft Architecture", icon: Network },
  { path: "/governance", label: "Governance & Controls", icon: ShieldCheck },
];

const layerKeys: { value: keyof Neighbourhood; label: string }[] = [
  { value: "score", label: "Composite growth opportunity" },
  { value: "growth", label: "Housing growth" },
  { value: "penetration", label: "Provider household penetration" },
  { value: "internetOpportunity", label: "Internet opportunity" },
  { value: "wirelessOpportunity", label: "Wireless opportunity" },
  { value: "mobileAttach", label: "Mobile attach potential" },
  { value: "competitive", label: "Competitive threat" },
  { value: "network", label: "Network readiness" },
  { value: "capitalEfficiency", label: "Capital efficiency" },
  { value: "churnExposure", label: "Churn exposure" },
  { value: "mduOpportunity", label: "Multi-dwelling unit opportunity" },
];

function App() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [approved, setApproved] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [demoKey, setDemoKey] = useState(0);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const resetDemo = () => {
    setApproved(false);
    setAnalysisComplete(false);
    setDemoKey((key) => key + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={dark ? "app dark" : "app light"} key={demoKey}>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <Link to="/" className="brand" aria-label="Growth Planning home">
          <span className="brand-mark">R</span>
          <span>
            <strong>Neighbourhood Growth Planning Agent</strong>
            <small>Consumer Growth • Concept Demonstration</small>
          </span>
        </Link>
        <div className="topbar-actions">
          <span className="status-pill"><span className="pulse" /> Agent System Active</span>
          <span className="date-pill">Analysis window: Q3 2026</span>
          <span className="synthetic-badge">Synthetic Data</span>
          <button className="icon-button" onClick={() => setDark(!dark)} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>
            {dark ? <Sun /> : <Moon />}
          </button>
          <button className="secondary-button compact-button" onClick={resetDemo}><RefreshCw size={15} /> Reset</button>
          <Link className="primary-button compact-button" to="/walkthrough"><Play size={15} /> Walkthrough</Link>
        </div>
      </header>
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <nav aria-label="Primary navigation">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} end={path === "/"}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-summary">
          <span>Portfolio intelligence</span>
          <strong>27 priority markets</strong>
          <div className="mini-progress"><i style={{ width: "73%" }} /></div>
          <small>14 approved or active plays</small>
        </div>
      </aside>
      <main id="main" className="main">
        <Routes>
          <RouterRoute path="/" element={<Dashboard />} />
          <RouterRoute path="/signals" element={<SignalRadar />} />
          <RouterRoute path="/map" element={<OpportunityMap />} />
          <RouterRoute path="/neighbourhood" element={<DeepDive />} />
          <RouterRoute path="/recommendation" element={<Recommendation approved={approved} setApproved={setApproved} analysisComplete={analysisComplete} setAnalysisComplete={setAnalysisComplete} />} />
          <RouterRoute path="/plan" element={<GrowthPlan approved={approved} />} />
          <RouterRoute path="/outcomes" element={<Outcomes />} />
          <RouterRoute path="/walkthrough" element={<Walkthrough />} />
          <RouterRoute path="/architecture" element={<Architecture />} />
          <RouterRoute path="/governance" element={<Governance />} />
          <RouterRoute path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer>
        <strong>Neighbourhood Growth Planning Agent</strong>
        <span>{disclaimer}</span>
      </footer>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: React.ReactNode }) {
  return (
    <div className="page-header">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function Simulated() {
  return <span className="simulated">SIMULATED</span>;
}

function Dashboard() {
  const navigate = useNavigate();
  const kpis = [
    ["186", "neighbourhoods evaluated", Map],
    ["27", "high-priority opportunities", Target],
    ["$84.6M", "five-year revenue opportunity", TrendingUp],
    ["42,300", "addressable households", Home],
    ["18,750", "mobile-line opportunities", Wifi],
    ["11", "competitive-risk areas", AlertTriangle],
    ["$31.4M", "proposed investment", CircleDollarSign],
    ["2.7x", "estimated portfolio return", Gauge],
    ["14", "approved or active plays", CheckCircle2],
  ] as const;
  const actionData = [
    { name: "Build", value: 5 }, { name: "Upgrade", value: 7 }, { name: "Market", value: 6 },
    { name: "Sell", value: 4 }, { name: "Defend", value: 3 }, { name: "Partner", value: 2 },
  ];
  const matrix = neighbourhoods.slice(0, 8);

  return (
    <>
      <PageHeader
        eyebrow="Executive Growth Dashboard"
        title="Find the Next Growth Market"
        description="Agentic AI brings network, market, customer, demographic, competitive, and financial signals together to recommend the next best neighbourhood growth action."
        actions={<button className="primary-button" onClick={() => navigate("/recommendation")}><Sparkles size={17} /> Review top recommendation</button>}
      />
      <div className="kpi-grid">
        {kpis.map(([value, label, Icon]) => (
          <Card className="kpi-card" key={label}>
            <div className="kpi-top"><Icon size={18} /><Simulated /></div>
            <strong>{value}</strong><span>{label}</span>
          </Card>
        ))}
      </div>
      <Card className="supervisor-summary">
        <div className="agent-avatar"><Bot /></div>
        <div>
          <span className="eyebrow">Growth Planning Supervisor • Executive brief</span>
          <h2>Twenty-seven neighbourhoods meet the current growth threshold.</h2>
          <p>The strongest combined opportunity is in <strong>Brookfield North</strong>, where new housing, limited provider penetration, strong family formation, high mobile attach potential, and planned fibre availability create an estimated five-year growth opportunity of <strong>$12.8M</strong>.</p>
        </div>
        <button className="secondary-button" onClick={() => navigate("/neighbourhood")}>Open evidence <ChevronRight size={16} /></button>
      </Card>
      <div className="dashboard-grid">
        <Card className="span-2">
          <div className="card-header"><div><span className="eyebrow">Prioritization</span><h2>Top neighbourhood opportunities</h2></div><Link to="/map">View map <ChevronRight size={15} /></Link></div>
          <div className="opportunity-list">
            {neighbourhoods.slice(0, 5).map((n, index) => (
              <button key={n.id} onClick={() => navigate("/neighbourhood")} className="opportunity-row">
                <span className="rank">{index + 1}</span>
                <span className="opportunity-name"><strong>{n.name}</strong><small>{n.reasons[0]} • {n.reasons[1]}</small></span>
                <span className={`action-tag ${n.action.toLowerCase()}`}>{n.action}</span>
                <span><strong>{n.score}</strong><small>score</small></span>
                <span><strong>{money(n.revenue)}</strong><small>revenue</small></span>
                <span><strong>{money(n.investment)}</strong><small>capital</small></span>
                <span><strong>{n.payback} mo.</strong><small>payback</small></span>
                <ChevronRight size={17} />
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <div className="card-header"><div><span className="eyebrow">Portfolio mix</span><h2>Opportunity by action</h2></div><Simulated /></div>
          <div className="chart-medium">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill="#e31837" radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="card-header"><div><span className="eyebrow">Product value</span><h2>Revenue opportunity</h2></div><Simulated /></div>
          <div className="donut-wrap">
            <ResponsiveContainer width="55%" height={220}>
              <PieChart><Pie data={productOpportunity} dataKey="value" innerRadius={55} outerRadius={82} paddingAngle={4}>{productOpportunity.map((item) => <Cell key={item.name} fill={item.colour} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
            <div className="legend">{productOpportunity.map((item) => <div key={item.name}><i style={{ background: item.colour }} /><span>{item.name}</span><strong>{money(item.value)}</strong></div>)}</div>
          </div>
        </Card>
        <Card>
          <div className="card-header"><div><span className="eyebrow">Decision frame</span><h2>Build versus market</h2></div></div>
          <div className="matrix">
            {matrix.map((n) => <div key={n.id} className="matrix-dot" style={{ left: `${Math.max(8, n.network - 8)}%`, bottom: `${Math.max(8, n.score - 8)}%` }} title={`${n.name}: readiness ${n.network}, opportunity ${n.score}`}><span>{n.name}</span></div>)}
            <div className="axis-label x">Network readiness →</div><div className="axis-label y">Opportunity →</div>
          </div>
        </Card>
        <Card>
          <div className="card-header"><div><span className="eyebrow">Agent activity</span><h2>Recent decisions</h2></div><span className="live-label"><i /> LIVE SIMULATION</span></div>
          <div className="activity-list">
            {signals.slice(0, 5).map((signal) => <div key={signal.id}><span className={signal.kind === "Risk" ? "event risk" : "event"}><Zap size={14} /></span><p><strong>{signal.title}</strong><small>{signal.agent} • {signal.recency}</small></p></div>)}
          </div>
        </Card>
      </div>
    </>
  );
}

function SignalRadar() {
  const [category, setCategory] = useState("All");
  const [kind, setKind] = useState("All");
  const [selected, setSelected] = useState<MarketSignal>(signals[0]);
  const filtered = signals.filter((s) => (category === "All" || s.category === category) && (kind === "All" || s.kind === kind));
  const categories = ["All", ...new Set(signals.map((s) => s.category))];

  return (
    <>
      <PageHeader eyebrow="Growth Signal Radar" title="Detect market change before it becomes obvious" description="A live simulated feed combines housing, demographic, commercial, network, competitive, community, and economic indicators." />
      <div className="filters">
        <label>Signal type<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>Opportunity or risk<select value={kind} onChange={(e) => setKind(e.target.value)}><option>All</option><option>Opportunity</option><option>Risk</option></select></label>
        <label>Confidence<select><option>All confidence</option><option>80% and above</option><option>90% and above</option></select></label>
        <label>Geography<select><option>All geographies</option>{neighbourhoods.map((n) => <option key={n.id}>{n.name}</option>)}</select></label>
        <label>Product<select><option>All products</option><option>Internet</option><option>Wireless</option><option>Wi-Fi</option></select></label>
      </div>
      <div className="signal-layout">
        <Card className="signal-feed">
          <div className="card-header"><div><span className="eyebrow">Signal stream</span><h2>{filtered.length} active signals</h2></div><span className="live-label"><i /> SCANNING</span></div>
          {filtered.map((signal) => (
            <button key={signal.id} onClick={() => setSelected(signal)} className={`signal-item ${selected.id === signal.id ? "selected" : ""}`}>
              <span className={`signal-icon ${signal.kind.toLowerCase()}`}>{signal.kind === "Risk" ? <AlertTriangle /> : <TrendingUp />}</span>
              <span><strong>{signal.title}</strong><small>{signal.geography} • {signal.category} • {signal.recency}</small></span>
              <span className="confidence"><strong>{signal.confidence}%</strong><small>confidence</small></span>
              <ChevronRight />
            </button>
          ))}
        </Card>
        <Card className="signal-detail">
          <span className="eyebrow">Selected signal</span>
          <div className="detail-title"><span className={`signal-icon ${selected.kind.toLowerCase()}`}>{selected.kind === "Risk" ? <AlertTriangle /> : <TrendingUp />}</span><div><h2>{selected.title}</h2><p>{selected.geography}</p></div></div>
          <div className="detail-grid">
            <Metric label="Source category" value={selected.source} />
            <Metric label="Confidence" value={`${selected.confidence}%`} />
            <Metric label="Strategic importance" value={selected.importance} />
            <Metric label="Product" value={selected.product} />
          </div>
          <DetailBlock title="Why it matters" text={selected.why} />
          <DetailBlock title="Potential provider action" text={selected.action} />
          <DetailBlock title="Privacy and permitted use" text={selected.privacy} icon={<ShieldCheck size={17} />} />
          <div className="related">
            <strong>Related signals</strong>
            {signals.filter((s) => s.id !== selected.id && (s.geography === selected.geography || s.category === selected.category)).slice(0, 3).map((s) => <button key={s.id} onClick={() => setSelected(s)}>{s.title}<ChevronRight size={14} /></button>)}
          </div>
        </Card>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}

function DetailBlock({ title, text, icon }: { title: string; text: string; icon?: React.ReactNode }) {
  return <div className="detail-block"><strong>{icon}{title}</strong><p>{text}</p></div>;
}

function OpportunityMap() {
  const [selected, setSelected] = useState(neighbourhoods[0]);
  const [layer, setLayer] = useState<keyof Neighbourhood>("score");
  const [compare, setCompare] = useState(false);
  const [overlay, setOverlay] = useState("None");
  const layerLabel = layerKeys.find((item) => item.value === layer)?.label;

  const colour = (n: Neighbourhood) => {
    const value = Number(n[layer]);
    if (layer === "competitive" || layer === "churnExposure") return value >= 80 ? "#ef4444" : value >= 60 ? "#f59e0b" : "#64748b";
    if (n.action === "BUILD" || n.action === "UPGRADE") return "#8b5cf6";
    if (n.action === "DEFEND") return "#f59e0b";
    if (value >= 80) return "#10b981";
    if (value >= 65) return "#2563eb";
    return "#64748b";
  };

  return (
    <>
      <PageHeader eyebrow="Market Opportunity Map" title="See where network and commercial opportunity converge" description="Synthetic regional opportunity zones remain fully usable without external map tiles." actions={<Link className="primary-button" to="/recommendation">Open recommendation <ChevronRight size={16} /></Link>} />
      <div className="map-toolbar">
        <label><Layers3 size={16} /> Map layer<select value={layer} onChange={(e) => setLayer(e.target.value as keyof Neighbourhood)}>{layerKeys.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <button className={compare ? "toggle active" : "toggle"} onClick={() => setCompare(!compare)}><GitBranch size={15} /> Region comparison</button>
        {["Approved plans", "Competitor activity", "New developments"].map((item) => <button key={item} className={overlay === item ? "toggle active" : "toggle"} onClick={() => setOverlay(overlay === item ? "None" : item)}>{item}</button>)}
      </div>
      <div className="map-layout">
        <Card className="map-card">
          <div className="map-heading"><div><strong>Synthetic Greater Toronto Growth Region</strong><span>{layerLabel}</span></div><div className="map-legend"><i className="green" />Growth <i className="blue" />Market <i className="purple" />Build <i className="amber" />Defend</div></div>
          <div className="synthetic-map" role="img" aria-label="Interactive synthetic regional opportunity map">
            <div className="road road-a" /><div className="road road-b" /><div className="road road-c" /><div className="water" />
            {neighbourhoods.map((n) => {
              const value = Number(n[layer]);
              const active = n.id === selected.id;
              return (
                <button
                  key={n.id}
                  className={`map-zone ${active ? "active" : ""}`}
                  style={{ left: `${n.x}%`, top: `${n.y}%`, background: colour(n), width: `${42 + value / 2}px`, height: `${42 + value / 2}px` }}
                  onClick={() => setSelected(n)}
                  aria-label={`${n.name}, ${layerLabel} ${value}`}
                >
                  <strong>{value}</strong><span>{n.name}</span>
                </button>
              );
            })}
            {overlay === "Competitor activity" && <div className="overlay-note competitor"><AlertTriangle size={15} /> 4 simulated fibre events</div>}
            {overlay === "New developments" && <div className="overlay-note development"><Building2 size={15} /> 7 active development zones</div>}
            {overlay === "Approved plans" && <div className="overlay-note approved"><Check size={15} /> 14 approved or active plays</div>}
            <div className="map-controls"><button aria-label="Zoom in">+</button><button aria-label="Zoom out">−</button><button aria-label="Reset map"><RefreshCw size={14} /></button></div>
          </div>
        </Card>
        <Card className="map-panel">
          <div className="score-ring" style={{ "--score": `${selected.score * 3.6}deg` } as React.CSSProperties}><span><strong>{selected.score}</strong><small>opportunity</small></span></div>
          <span className={`action-tag ${selected.action.toLowerCase()}`}>{selected.action}</span>
          <h2>{selected.name}</h2>
          <p>{selected.reasons.join(" • ")}</p>
          <div className="score-bars">
            <ScoreBar label="Growth" value={selected.growth} />
            <ScoreBar label="Network readiness" value={selected.network} />
            <ScoreBar label="Competitive intensity" value={selected.competitive} />
            <ScoreBar label="Product opportunity" value={selected.internetOpportunity} />
            <ScoreBar label="Confidence" value={selected.confidence} />
          </div>
          <div className="detail-grid">
            <Metric label="Households" value={compact.format(selected.households)} />
            <Metric label="Addressable" value={compact.format(selected.addressableHouseholds)} />
            <Metric label="Investment" value={money(selected.investment)} />
            <Metric label="Revenue" value={money(selected.revenue)} />
          </div>
          <Link className="primary-button full" to="/neighbourhood">Open neighbourhood deep dive <ChevronRight size={16} /></Link>
        </Card>
      </div>
      {compare && <Card className="comparison-strip"><div className="card-header"><div><span className="eyebrow">Region comparison</span><h2>Top opportunity versus portfolio</h2></div><button className="icon-button" onClick={() => setCompare(false)}><X /></button></div><div className="comparison-table">{neighbourhoods.slice(0, 6).map((n) => <div key={n.id}><strong>{n.name}</strong><span>{n.score} score</span><span>{money(n.revenue)}</span><span>{n.network}% ready</span><span className={`action-tag ${n.action.toLowerCase()}`}>{n.action}</span></div>)}</div></Card>}
    </>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return <div><span><b>{label}</b><b>{value}</b></span><i><em style={{ width: `${value}%` }} /></i></div>;
}

function DeepDive() {
  const [selectedId, setSelectedId] = useState("brookfield");
  const [drawer, setDrawer] = useState(false);
  const selected = neighbourhoods.find((n) => n.id === selectedId) ?? neighbourhoods[0];
  const growthData = [
    { year: "2025", households: 6850 }, { year: "2026", households: 7210 }, { year: "2027", households: 7840 },
    { year: "2028", households: 8510 }, { year: "2029", households: 9000 }, { year: "2030", households: 9250 },
  ].map((d) => ({ ...d, households: Math.round(d.households * selected.households / 6850) }));
  const penetration = [
    { product: "Internet", Current: selected.penetration, Benchmark: 56 },
    { product: "Wireless", Current: 42, Benchmark: 61 },
    { product: "Mobile attach", Current: 37, Benchmark: 54 },
    { product: "Premium Wi-Fi", Current: 21, Benchmark: 38 },
  ];
  const evidence = [
    ["Observed signal", "Municipal planning data indicates 2,400 planned homes.", "Public • 96% confidence"],
    ["Observed signal", "Aggregated serviceability searches increased 31%.", "Internal • 85% confidence"],
    ["Model estimate", "Family household formation is forecast to grow 7.8%.", "Model v2.4 • 88% confidence"],
    ["Agent inference", "The early-mover acquisition window is narrowing.", "Competitive Agent • 84% confidence"],
    ["Business rule", "Investment above $3M requires finance approval.", "Capital authority policy"],
    ["Human assumption", "Targeted upgrade can complete before first major occupancy.", "Planning input • review required"],
  ];

  return (
    <>
      <PageHeader eyebrow="Neighbourhood Deep Dive" title={selected.name} description="A complete, explainable view of demand, market position, feasibility, economics, evidence, risk, and assumptions." actions={<><select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} aria-label="Select neighbourhood">{neighbourhoods.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}</select><button className="secondary-button" onClick={() => setDrawer(true)}><FileSearch size={16} /> Open evidence</button></>} />
      <Card className="profile-hero">
        <div><span className={`action-tag ${selected.action.toLowerCase()}`}>{selected.action}</span><h2>{selected.name} is the strongest combined network and commercial growth opportunity.</h2><p>Growing family formation, strong connectivity demand, low provider penetration, practical fibre proximity, installation readiness, and competitive fibre activity support a coordinated response.</p><div className="reason-chips">{selected.reasons.map((r) => <span key={r}><Check size={13} />{r}</span>)}</div></div>
        <div className="hero-score"><strong>{selected.score}</strong><span>Composite opportunity</span><small>{selected.confidence}% confidence</small></div>
      </Card>
      <div className="profile-grid">
        <Card><span className="eyebrow">Population & housing</span><h2>{compact.format(selected.households)} current households</h2><p>2,400 additional homes planned • 7.8% forecast population growth • family formation above the regional average.</p><div className="chart-small"><ResponsiveContainer><AreaChart data={growthData}><defs><linearGradient id="growth" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="year"/><YAxis hide domain={["dataMin - 500", "dataMax + 300"]}/><Tooltip/><Area dataKey="households" stroke="#10b981" fill="url(#growth)" strokeWidth={3}/></AreaChart></ResponsiveContainer></div></Card>
        <Card><span className="eyebrow">Provider relationship</span><h2>Whitespace across the household</h2><p>Internet and wireless penetration remain below comparable-market benchmarks, creating multi-product potential.</p><div className="chart-small"><ResponsiveContainer><BarChart data={penetration} layout="vertical"><CartesianGrid strokeDasharray="3 3" horizontal={false}/><XAxis type="number" hide/><YAxis dataKey="product" type="category" width={84} tick={{fontSize: 11}}/><Tooltip/><Bar dataKey="Current" fill="#e31837" radius={[0,5,5,0]}/><Bar dataKey="Benchmark" fill="#475569" radius={[0,5,5,0]}/></BarChart></ResponsiveContainer></div></Card>
        <Card><span className="eyebrow">Network & serviceability</span><h2>Targeted upgrade is feasible</h2><div className="big-metric-row"><div><strong>82%</strong><span>network readiness</span></div><div><strong>Near</strong><span>fibre backhaul</span></div><div><strong>Ready</strong><span>installation capacity</span></div></div><p>Existing infrastructure can support an initial phase. A targeted upgrade is required for full development coverage.</p></Card>
        <Card><span className="eyebrow">Competition</span><h2>Early-mover window is narrowing</h2><div className="threat-meter"><span style={{width: `${selected.competitive}%`}} /><b>{selected.competitive}/100 urgency</b></div><p>Simulated competitor fibre construction, introductory pricing, and local promotion increase the cost of delay.</p><div className="risk-callout"><AlertTriangle size={18} /> Verified and inferred signals are separated in the evidence trace.</div></Card>
        <Card><span className="eyebrow">Consumer behaviours</span><h2>Connectivity-intensive households</h2><div className="behaviour-grid">{[["71%","family households"],["46%","work from home"],["31%","digital intent lift"],["High","whole-home Wi-Fi demand"]].map(([v,l])=><div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div></Card>
        <Card><span className="eyebrow">Product opportunity</span><h2>{money(selected.revenue)} illustrative value</h2><div className="product-bars">{productOpportunity.map((p)=><div key={p.name}><span>{p.name}<b>{money(p.value)}</b></span><i><em style={{width:`${p.value/5.8*100}%`,background:p.colour}}/></i></div>)}</div></Card>
        <Card><span className="eyebrow">Financial attractiveness</span><h2>2.7x revenue-to-investment</h2><div className="big-metric-row"><div><strong>{money(selected.investment)}</strong><span>investment</span></div><div><strong>{money(selected.revenue)}</strong><span>5-year revenue</span></div><div><strong>{selected.payback} mo.</strong><span>payback</span></div></div><p className="formula">Estimated revenue = Internet + mobile + Wi-Fi + other product revenue. Revenue is illustrative and not guaranteed.</p></Card>
        <Card><span className="eyebrow">Risks & assumptions</span><h2>Four items require executive attention</h2><ul className="clean-list"><li><AlertTriangle/>Build completion before first occupancy wave</li><li><AlertTriangle/>Competitive response may increase acquisition cost</li><li><AlertTriangle/>Adoption rate is a model assumption</li><li><AlertTriangle/>External data rights require production validation</li></ul></Card>
      </div>
      {drawer && <div className="drawer-backdrop" onClick={() => setDrawer(false)}><aside className="evidence-drawer" onClick={(e)=>e.stopPropagation()}><div className="card-header"><div><span className="eyebrow">Agent evidence</span><h2>Recommendation trace</h2></div><button className="icon-button" onClick={()=>setDrawer(false)}><X/></button></div><p>Every input is labelled by evidence type so executives can distinguish what was observed, estimated, inferred, ruled, or assumed.</p>{evidence.map(([type,text,source])=><div className="evidence-item" key={text}><span className={`evidence-type ${type.toLowerCase().replace(" ","-")}`}>{type}</span><strong>{text}</strong><small>{source}</small></div>)}</aside></div>}
    </>
  );
}

function Recommendation({ approved, setApproved, analysisComplete, setAnalysisComplete }: { approved: boolean; setApproved: (value: boolean) => void; analysisComplete: boolean; setAnalysisComplete: (value: boolean) => void }) {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(analysisComplete ? agents.length : 0);
  const [assumptions, setAssumptions] = useState(defaultAssumptions);
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();
  const result = calculateBusinessCase(assumptions);

  useEffect(() => {
    if (!running) return;
    if (step >= agents.length) {
      setRunning(false);
      setAnalysisComplete(true);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 800);
    return () => window.clearTimeout(timer);
  }, [running, step, setAnalysisComplete]);

  const run = () => { setStep(0); setAnalysisComplete(false); setRunning(true); };
  const decision = (message: string) => { setNotice(message); if (message.startsWith("Approved")) setApproved(true); };

  return (
    <>
      <PageHeader eyebrow="Agent Recommendation" title="Approve a targeted upgrade and coordinated neighbourhood launch" description="Brookfield North • Scenario B • Executive decision workspace" actions={<button className="primary-button" disabled={running} onClick={run}>{running ? <Activity className="spin" size={17}/> : <Sparkles size={17}/>} {running ? "Agents analysing…" : "Run Agent Analysis"}</button>} />
      <Card className="recommendation-banner">
        <div className="recommendation-icon"><Lightbulb /></div>
        <div><span className="eyebrow">Growth Planning Supervisor recommendation</span><h2>Target the first major occupancy wave with a network-ready, multi-product household proposition.</h2><p>Begin developer and property-partner engagement, establish an early-mover acquisition campaign, prioritize home Internet plus mobile household offers, and stage installation capacity before occupancy.</p></div>
        <div className="confidence-badge"><strong>91%</strong><span>confidence</span></div>
      </Card>
      <Card>
        <div className="card-header"><div><span className="eyebrow">Multi-agent workflow</span><h2>Six agents, one recommendation</h2></div><span className="live-label"><i/> {running ? "ANALYSIS RUNNING" : analysisComplete ? "ANALYSIS COMPLETE" : "READY"}</span></div>
        <div className="agent-grid">
          {agents.map((agent, index) => {
            const done = index < step || analysisComplete;
            const active = running && index === step;
            return <div className={`agent-card ${done ? "done" : ""} ${active ? "active" : ""}`} key={agent.name}><div className="agent-card-top"><span>{done ? <Check/> : active ? <Activity className="spin"/> : <Bot/>}</span><small>{done ? "Complete" : active ? "Working" : "Queued"}</small></div><strong>{agent.name}</strong><p>{agent.task}</p><div className="agent-output"><span>Key output</span>{done ? agent.output : "Awaiting analysis"}</div><div className="agent-meta"><span>{agent.confidence}% confidence</span><span>{agent.data}</span></div></div>;
          })}
        </div>
      </Card>
      <div className="section-title"><span className="eyebrow">Scenario comparison</span><h2>Executives receive choices, not a black-box answer</h2></div>
      <div className="scenario-grid">
        {scenarios.map((s) => <Card key={s.id} className={`scenario-card ${s.id === "B" ? "recommended" : ""}`}><div className="scenario-head"><span>Scenario {s.id}</span>{s.id === "B" && <b>RECOMMENDED</b>}</div><h2>{s.name}</h2><p>{s.action}</p><div className="scenario-metrics"><Metric label="Investment" value={money(s.investment)}/><Metric label="5-year revenue" value={money(s.revenue)}/><Metric label="Payback" value={`${s.payback} months`}/><Metric label="Opportunities" value={compact.format(s.customers)}/></div><div className="risk-line"><AlertTriangle size={14}/>{s.risk}</div><button className={s.id === "B" ? "primary-button full" : "secondary-button full"} onClick={()=>setNotice(`Scenario ${s.id} selected for comparison.`)}>Compare Scenario {s.id}</button></Card>)}
      </div>
      <div className="recommendation-workspace">
        <Card>
          <div className="card-header"><div><span className="eyebrow">Change assumptions</span><h2>Transparent business case</h2></div><button className="text-button" onClick={()=>setAssumptions(defaultAssumptions)}><RefreshCw size={14}/>Reset</button></div>
          <div className="assumptions">
            <Slider label="Adoption assumption" value={assumptions.adoption} min={20} max={60} suffix="%" onChange={(value)=>setAssumptions({...assumptions,adoption:value})}/>
            <Slider label="Internet monthly revenue" value={assumptions.internetArpu} min={70} max={130} prefix="$" onChange={(value)=>setAssumptions({...assumptions,internetArpu:value})}/>
            <Slider label="Mobile attach" value={assumptions.mobileAttach} min={25} max={80} suffix="%" onChange={(value)=>setAssumptions({...assumptions,mobileAttach:value})}/>
            <Slider label="Wi-Fi attach" value={assumptions.wifiAttach} min={15} max={65} suffix="%" onChange={(value)=>setAssumptions({...assumptions,wifiAttach:value})}/>
            <Slider label="Capital investment" value={assumptions.capital} min={3} max={8} step={0.1} prefix="$" suffix="M" onChange={(value)=>setAssumptions({...assumptions,capital:value})}/>
            <Slider label="Margin assumption" value={assumptions.margin} min={30} max={65} suffix="%" onChange={(value)=>setAssumptions({...assumptions,margin:value})}/>
            <Slider label="Competitive intensity" value={assumptions.competitiveIntensity} min={20} max={100} suffix="/100" onChange={(value)=>setAssumptions({...assumptions,competitiveIntensity:value})}/>
            <Slider label="Build completion risk" value={assumptions.buildRisk} min={0} max={45} suffix="%" onChange={(value)=>setAssumptions({...assumptions,buildRisk:value})}/>
          </div>
        </Card>
        <Card className="case-results">
          <span className="eyebrow">Updated illustrative case</span><h2>{money(result.totalRevenue / 1_000_000)} estimated five-year revenue</h2>
          <div className="result-grid"><Metric label="Internet customers" value={compact.format(result.internetCustomers)}/><Metric label="Mobile lines" value={compact.format(result.mobileLines)}/><Metric label="Wi-Fi customers" value={compact.format(result.wifiCustomers)}/><Metric label="Investment" value={money(result.investment / 1_000_000)}/><Metric label="Revenue / investment" value={`${result.ratio.toFixed(1)}x`}/><Metric label="Payback" value={`${Math.round(result.payback)} months`}/></div>
          <div className="formula-box"><strong>Calculation explanation</strong><code>Households acquired = 4,150 × {assumptions.adoption}%</code><code>Total revenue = Internet + mobile + Wi-Fi + other revenue</code><code>Payback = investment ÷ monthly contribution</code><p>Values update immediately and remain estimates, not guaranteed outcomes.</p></div>
        </Card>
      </div>
      <Card className="approval-card">
        <div><span className="eyebrow">Human decision required</span><h2>Agents recommend. Business leaders decide.</h2><p>No capital, customer offer, campaign, or network action is executed by this demonstration.</p></div>
        <div className="approval-actions">
          <button className="primary-button" onClick={()=>decision("Approved for planning. Cross-functional workstreams are now available.")}><CheckCircle2 size={17}/>Approve for planning</button>
          <button className="secondary-button" onClick={()=>decision("Revision requested. The recommendation remains in review.")}>Request revision</button>
          <button className="secondary-button" onClick={()=>decision("Owner assigned by role: Regional Growth Leader.")}>Assign owner</button>
          <button className="secondary-button" onClick={()=>decision("Recommendation deferred for the next analysis window.")}>Defer</button>
          <button className="danger-button" onClick={()=>decision("Recommendation rejected. No action was executed.")}>Reject</button>
        </div>
        {(notice || approved) && <div className="decision-notice"><CheckCircle2 size={18}/><span>{notice || "Approved for planning."}</span>{approved && <button onClick={()=>navigate("/plan")}>Generate growth plan <ChevronRight size={15}/></button>}</div>}
      </Card>
    </>
  );
}

function Slider({ label, value, min, max, step = 1, prefix = "", suffix = "", onChange }: { label: string; value: number; min: number; max: number; step?: number; prefix?: string; suffix?: string; onChange: (value: number) => void }) {
  return <label className="slider"><span>{label}<strong>{prefix}{value}{suffix}</strong></span><input type="range" min={min} max={max} step={step} value={value} onChange={(e)=>onChange(Number(e.target.value))}/></label>;
}

function GrowthPlan({ approved }: { approved: boolean }) {
  const [generated, setGenerated] = useState(approved);
  if (!generated) return <div className="empty-state"><ClipboardCheck size={52}/><span className="eyebrow">Growth Plan</span><h1>Human approval is required before detailed planning begins</h1><p>The recommendation can prepare a draft, but it cannot initiate operational workstreams without authorization.</p><Link className="primary-button" to="/recommendation">Review recommendation</Link><button className="secondary-button" onClick={()=>setGenerated(true)}>Preview simulated approved plan</button></div>;
  return (
    <>
      <PageHeader eyebrow="Growth Plan" title="Brookfield North coordinated launch plan" description="Six linked workstreams share the same opportunity definition, sequencing, approval gates, risks, and expected outcomes." actions={<span className="approval-status"><CheckCircle2/> Approved for planning • simulated</span>} />
      <Card className="timeline-card"><div className="card-header"><div><span className="eyebrow">Integrated timeline</span><h2>Signal to launch readiness</h2></div><Simulated/></div><div className="plan-timeline">{["Executive approval","Field validation","Offer & campaign design","Upgrade delivery","Channel readiness","Neighbourhood launch","Outcome review"].map((item,index)=><div key={item} className={index===0?"complete":index<4?"active":""}><span>{index===0?<Check size={14}/>:index+1}</span><strong>{item}</strong><small>Week {index*3+1}</small></div>)}</div></Card>
      <div className="workstream-grid">{workstreams.map((w)=><Card key={w.name} className="workstream-card"><div className="workstream-head"><span className="workstream-icon">{w.name==="Network"?<Network/>:w.name==="Marketing"?<Target/>:w.name==="Finance"?<CircleDollarSign/>:w.name==="Governance"?<ShieldCheck/>:<Users/>}</span><div><span className="eyebrow">{w.owner}</span><h2>{w.name}</h2></div><span className="progress-number">{w.progress}%</span></div><p>{w.tasks}</p><div className="progress-bar"><i style={{width:`${w.progress}%`}}/></div><div className="gate"><ShieldCheck size={15}/><span>Next gate</span><strong>{w.gate}</strong></div><div className="workstream-footer"><span>Owner is a role, not a person</span><button>View tasks <ChevronRight size={14}/></button></div></Card>)}</div>
      <Card><div className="card-header"><div><span className="eyebrow">Dependencies & controls</span><h2>Plan orchestration</h2></div></div><div className="dependency-table"><div><strong>Dependency</strong><strong>Required before</strong><strong>Owner</strong><strong>Status</strong></div>{[["Capital estimate validated","Field design approval","Consumer Finance","In progress"],["Data permitted-purpose confirmed","Campaign activation","Data & AI Governance","Review"],["Offer eligibility confirmed","Channel training","Product","In progress"],["Installation capacity reserved","Neighbourhood launch","Field Operations","Not started"]].map(row=><div key={row[0]}>{row.map((cell,i)=><span key={cell} className={i===3?"status-cell":""}>{cell}</span>)}</div>)}</div></Card>
    </>
  );
}

function Outcomes() {
  const trend = [
    { month: "M1", planned: 180, actual: 165 }, { month: "M2", planned: 390, actual: 372 }, { month: "M3", planned: 640, actual: 618 },
    { month: "M4", planned: 920, actual: 905 }, { month: "M5", planned: 1240, actual: 1275 }, { month: "M6", planned: 1600, actual: 1642 },
  ];
  const portfolio = neighbourhoods.slice(0, 8);
  return (
    <>
      <PageHeader eyebrow="Business Outcomes Centre" title="Connect every investment to measurable household growth" description="Illustrative planned-versus-actual-style metrics demonstrate how approved plans could be monitored. These are not actual company results." />
      <div className="outcome-tabs">{["Growth","Investment","Execution","Customer"].map((tab,index)=><div key={tab}><span>{tab}</span><strong>{[["1,642","new Internet customers"],["$9.8M","illustrative revenue"],["21 days","signal to plan"],["4.3","products per household"]][index][0]}</strong><small>{[["1,642","new Internet customers"],["$9.8M","illustrative revenue"],["21 days","signal to plan"],["4.3","products per household"]][index][1]}</small></div>)}</div>
      <div className="dashboard-grid">
        <Card className="span-2"><div className="card-header"><div><span className="eyebrow">Growth trajectory</span><h2>Planned versus illustrative actual acquisition</h2></div><Simulated/></div><div className="chart-large"><ResponsiveContainer><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month"/><YAxis/><Tooltip/><Line type="monotone" dataKey="planned" stroke="#64748b" strokeWidth={2} strokeDasharray="6 4"/><Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3}/></LineChart></ResponsiveContainer></div></Card>
        <Card><span className="eyebrow">Investment performance</span><h2>2.4x current outlook</h2><div className="gauge"><span style={{"--gauge":"240deg"} as React.CSSProperties}/><strong>2.4x</strong></div><p>Illustrative revenue-to-investment outlook against a 2.1x plan threshold.</p></Card>
        <Card><span className="eyebrow">Execution health</span><h2>88% plan completion</h2><div className="outcome-bars"><ScoreBar label="Network readiness" value={91}/><ScoreBar label="Campaign readiness" value={84}/><ScoreBar label="Channel readiness" value={79}/><ScoreBar label="Governance controls" value={96}/></div></Card>
      </div>
      <Card><div className="card-header"><div><span className="eyebrow">Portfolio view</span><h2>Opportunity, return, risk, readiness, and status</h2></div></div><div className="portfolio-table"><div><strong>Neighbourhood</strong><strong>Opportunity</strong><strong>Investment</strong><strong>Return</strong><strong>Risk</strong><strong>Readiness</strong><strong>Status</strong></div>{portfolio.map(n=><div key={n.id}><span><b>{n.name}</b><small>{n.action}</small></span><span>{n.score}</span><span>{money(n.investment)}</span><span>{(n.revenue/n.investment).toFixed(1)}x</span><span>{n.competitive>=80?"High":n.competitive>=60?"Medium":"Low"}</span><span>{n.network}%</span><span className={`status ${n.status.toLowerCase()}`}>{n.status}</span></div>)}</div></Card>
    </>
  );
}

function Walkthrough() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const navigate = useNavigate();
  useEffect(()=>{
    if(!playing) return;
    const timer=window.setInterval(()=>setIndex(current=>current>=walkthrough.length-1?0:current+1),5000);
    return ()=>window.clearInterval(timer);
  },[playing]);
  const step=walkthrough[index];
  return (
    <div className="walkthrough">
      <div className="walkthrough-top"><div><span className="eyebrow">Executive Walkthrough</span><strong>Step {index+1} of {walkthrough.length}</strong></div><div><button className="secondary-button" onClick={()=>setPlaying(!playing)}>{playing?<Pause size={15}/>:<Play size={15}/>} {playing?"Pause":"Auto Play"}</button><button className="icon-button" onClick={()=>navigate("/")} aria-label="Exit walkthrough"><X/></button></div></div>
      <div className="walkthrough-progress">{walkthrough.map((_,i)=><button key={i} className={i<=index?"active":""} onClick={()=>setIndex(i)} aria-label={`Go to step ${i+1}`}/>)}</div>
      <Card className="walkthrough-stage">
        <div className="stage-number">0{index+1}</div>
        <div className="stage-content"><span className="eyebrow">{index===walkthrough.length-1?"The strategic message":"Decision story"}</span><h1>{step.title}</h1><p>{step.text}</p><div className="stage-metric"><Sparkles/><span>{step.metric}</span></div>{index===walkthrough.length-1&&<blockquote>Find the market. Validate the opportunity. Approve the plan. Measure the growth.</blockquote>}</div>
        <WalkthroughVisual index={index}/>
      </Card>
      <div className="walkthrough-controls"><button className="secondary-button" disabled={index===0} onClick={()=>setIndex(index-1)}><ArrowLeft size={17}/>Back</button><span>{disclaimer}</span><button className="primary-button" onClick={()=>index===walkthrough.length-1?navigate("/"):setIndex(index+1)}>{index===walkthrough.length-1?"Finish":"Next"}<ArrowRight size={17}/></button></div>
    </div>
  );
}

function WalkthroughVisual({index}:{index:number}) {
  if(index===0) return <div className="fragment-visual">{["Housing & demographics","Network planning","Commercial performance","Competitive activity","Capital planning"].map((x,i)=><span key={x} style={{transform:`translate(${i%2?30:-20}px,${i*8}px)`}}>{x}</span>)}</div>;
  if(index===1) return <div className="signal-animation">{signals.slice(0,5).map((s,i)=><span key={s.id} style={{animationDelay:`${i*.25}s`}}><Zap/>{s.category}</span>)}<Bot/></div>;
  if(index===2) return <div className="priority-visual"><div className="score-ring large" style={{"--score":"338deg"} as React.CSSProperties}><span><strong>94</strong><small>priority</small></span></div><h3>Brookfield North</h3><p>↑ 18 positions this analysis window</p></div>;
  if(index===3) return <div className="agent-orbit"><Bot className="centre"/>{agents.slice(1).map((a,i)=><span key={a.name} className={`orbit orbit-${i}`}><Check/>{a.shortName}</span>)}</div>;
  if(index===4) return <div className="scenario-mini">{scenarios.map(s=><div key={s.id} className={s.id==="B"?"active":""}><span>{s.id}</span><strong>{s.name}</strong><small>{money(s.revenue)} • {s.payback} mo.</small></div>)}</div>;
  if(index===5) return <div className="recommendation-visual"><Target/><strong>UPGRADE + LAUNCH</strong><span>Internet • Mobile • Wi-Fi</span><div><b>$4.7M</b><b>→</b><b>$12.8M</b></div></div>;
  if(index===6) return <div className="approval-visual"><Bot/><ArrowRight/><button><CheckCircle2/>Human approval</button><ArrowRight/><ShieldCheck/></div>;
  if(index===7) return <div className="plan-visual">{workstreams.map((w,i)=><span key={w.name} style={{width:`${45+i*7}%`}}>{w.name}<i/></span>)}</div>;
  if(index===8) return <div className="outcome-visual"><TrendingUp/><strong>+1,642</strong><span>illustrative Internet customers</span><div><b>2.4x</b><b>88%</b><b>21 days</b></div></div>;
  return <div className="final-visual"><Sparkles/><strong>Continuous market intelligence</strong><span>Signals → decisions → plans → outcomes</span></div>;
}

function Architecture() {
  const layers = [
    ["Experience layer", "Custom responsive web application • Azure Static Web Apps • Teams option • Microsoft 365 Copilot option • Power BI Embedded • Dynamics 365", "experience"],
    ["Agent & orchestration", "Microsoft Foundry • Azure OpenAI • Agent Service patterns • tool calling • prompt management • evaluation • human approval", "agent"],
    ["Intelligence & modelling", "Azure Machine Learning • geospatial scoring • demand forecasting • propensity • scenarios • risk • optimisation • monitoring", "model"],
    ["Data foundation", "Microsoft Fabric • OneLake • Data Factory • Real-Time Intelligence • Eventstreams • Data Science • semantic models • Azure AI Search", "data"],
    ["Enterprise integration", "Proposed API integration: CRM • billing • product • order management • care • digital • network • serviceability • field operations • finance", "integration"],
    ["External data", "Configurable connectors: municipal open data • permits • housing • census • licensed real estate • competition • schools • transit", "external"],
    ["Security & governance", "Entra ID • managed identities • RBAC • Purview • Defender • Key Vault • Azure Monitor • audit • Responsible AI • retention", "security"],
  ];
  return (
    <>
      <PageHeader eyebrow="Microsoft Architecture" title="A governed path from market signals to human-approved action" description="Illustrative target architecture. Proposed products, connectors, and enterprise integrations do not imply current production implementation." />
      <Card className="architecture-flow"><div className="card-header"><div><span className="eyebrow">End-to-end flow</span><h2>Decision intelligence architecture</h2></div></div><div className="flow-row">{["Data sources","Fabric & OneLake","Geospatial & customer models","Foundry agent system","Scenarios & recommendations","Human approval","Enterprise workflows","Outcome measurement"].map((item,i)=><div key={item}><span>{[<Database/>,<Layers3/>,<Gauge/>,<Bot/>,<Lightbulb/>,<ShieldCheck/>,<Route/>,<TrendingUp/>][i]}</span><strong>{item}</strong>{i<7&&<ChevronRight/>}</div>)}</div></Card>
      <div className="architecture-layers">{layers.map(([title,content,type],i)=><Card key={title} className={`architecture-layer ${type}`}><div className="layer-number">{String(i+1).padStart(2,"0")}</div><div><span className="eyebrow">{type}</span><h2>{title}</h2><p>{content}</p>{type==="external"&&<div className="architecture-warning"><AlertTriangle/>Legal, privacy, procurement, and licensing validation required before production use.</div>}{type==="integration"&&<div className="architecture-warning"><AlertTriangle/>All enterprise integration points are proposed, not connected.</div>}</div></Card>)}</div>
      <Card><div className="card-header"><div><span className="eyebrow">Integration services</span><h2>Secure batch, API, and streaming patterns</h2></div></div><div className="technology-grid">{["Azure API Management","Azure Functions","Azure Logic Apps","Azure Event Hubs","Microsoft Graph where appropriate","TM Forum Open APIs where relevant"].map(item=><div key={item}><Zap/><strong>{item}</strong></div>)}</div></Card>
    </>
  );
}

function Governance() {
  const controls = [
    ["Data-source authorization","Pass","18 of 18 demo sources classified"],
    ["Consent & permitted purpose","Review","Customer activation remains blocked"],
    ["Model version","Pass","Opportunity model v2.4"],
    ["Agent version","Pass","Supervisor prompt set v1.8"],
    ["Recommendation confidence","Pass","91% versus 80% threshold"],
    ["Evidence trace","Pass","12 sources and assumptions linked"],
    ["Human approvals","Required","Planning and execution gates"],
    ["Financial threshold","Required","$4.7M exceeds delegated threshold"],
    ["Privacy review","Review","Required before customer activation"],
    ["Outcome monitoring","Pass","Variance and drift checks configured"],
  ];
  const principles = [
    "No customer-level activation without a permitted purpose.",
    "No use of unlicensed external data.",
    "No autonomous capital commitment.",
    "No autonomous customer offer creation.",
    "No unsupported financial forecast.",
    "No network action without the appropriate operational control.",
    "Material recommendations require evidence and confidence.",
    "Low-confidence opportunities are routed to review.",
    "Executives can inspect and change assumptions.",
    "Every recommendation and approval is auditable.",
    "Protected customer characteristics must not be used for discriminatory targeting.",
    "Agents operate using least-privilege access.",
  ];
  return (
    <>
      <PageHeader eyebrow="Governance & Controls" title="Every recommendation is bounded, explainable, and auditable" description="The system observes and recommends. Authorized business leaders and existing operating processes retain decision authority." />
      <div className="governance-summary"><Card><ShieldCheck/><strong>12</strong><span>operating principles</span></Card><Card><FileSearch/><strong>100%</strong><span>evidence trace coverage</span></Card><Card><Users/><strong>2</strong><span>human approval gates</span></Card><Card><AlertTriangle/><strong>0</strong><span>autonomous material actions</span></Card></div>
      <div className="governance-layout">
        <Card><div className="card-header"><div><span className="eyebrow">Control dashboard</span><h2>Brookfield North recommendation</h2></div><Simulated/></div><div className="control-list">{controls.map(([name,status,detail])=><div key={name}><span className={`control-status ${status.toLowerCase()}`}>{status==="Pass"?<Check/>:<AlertTriangle/>}</span><span><strong>{name}</strong><small>{detail}</small></span><ChevronRight/></div>)}</div></Card>
        <Card><span className="eyebrow">Action authority</span><h2>Clear boundaries for agent action</h2><div className="authority-model"><div><span>01</span><strong>Observe</strong><p>Agents collect, explain, and rank information.</p></div><div><span>02</span><strong>Recommend</strong><p>Agents prepare scenarios and suggested actions.</p></div><div><span>03</span><strong>Approve for planning</strong><p>An authorized human allows detailed planning to begin.</p></div><div><span>04</span><strong>Approve for execution</strong><p>Existing operating and financial processes authorize actual activity.</p></div></div></Card>
      </div>
      <Card><div className="card-header"><div><span className="eyebrow">Operating principles</span><h2>Responsible decision system</h2></div></div><div className="principles">{principles.map((p,i)=><div key={p}><span>{i+1}</span><p>{p}</p></div>)}</div></Card>
      <Card><div className="card-header"><div><span className="eyebrow">Audit history</span><h2>Material events</h2></div></div><div className="audit-table">{[["10:22","Market Signal Agent","Added 820-unit approval signal","Evidence attached"],["10:24","Network Readiness Agent","Completed feasibility review","No operational action"],["10:27","Investment & ROI Agent","Updated Scenario B economics","Assumptions logged"],["10:31","Growth Planning Supervisor","Published recommendation v3","Awaiting human decision"]].map(row=><div key={row[0]}>{row.map(cell=><span key={cell}>{cell}</span>)}</div>)}</div></Card>
    </>
  );
}

export default App;
