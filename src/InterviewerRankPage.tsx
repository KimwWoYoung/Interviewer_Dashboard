import React, { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import { motion } from "framer-motion";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Download, Filter } from "lucide-react";

// Demo data schema (replace with your API)
const DEMO = [
  { interviewer_id: 1, name: "김하늘", team: "A", completed: 124, conversion_rate: 78.2, avg_duration: 18.3, qa_score: 92, period: "MONTH" },
  { interviewer_id: 2, name: "박지우", team: "A", completed: 118, conversion_rate: 83.1, avg_duration: 16.1, qa_score: 88, period: "MONTH" },
  { interviewer_id: 3, name: "이서준", team: "B", completed: 53,  conversion_rate: 55.0, avg_duration: 22.5, qa_score: 70, period: "WEEK" },
  { interviewer_id: 4, name: "최민서", team: "C", completed: 77,  conversion_rate: 61.3, avg_duration: 20.4, qa_score: 75, period: "DAY" },
  { interviewer_id: 5, name: "홍가람", team: "B", completed: 142, conversion_rate: 88.2, avg_duration: 15.2, qa_score: 95, period: "MONTH" },
  { interviewer_id: 6, name: "정윤아", team: "C", completed: 31,  conversion_rate: 49.8, avg_duration: 28.1, qa_score: 60, period: "DAY" },
  { interviewer_id: 7, name: "신도윤", team: "A", completed: 98,  conversion_rate: 72.4, avg_duration: 19.1, qa_score: 81, period: "WEEK" },
  { interviewer_id: 8, name: "문태양", team: "B", completed: 11,  conversion_rate: 41.0, avg_duration: 35.3, qa_score: 55, period: "DAY" },
  { interviewer_id: 9, name: "오세림", team: "C", completed: 64,  conversion_rate: 63.0, avg_duration: 21.0, qa_score: 78, period: "WEEK" },
  { interviewer_id: 10, name: "한유진", team: "B", completed: 150, conversion_rate: 90.1, avg_duration: 14.8, qa_score: 97, period: "MONTH" },
  { interviewer_id: 11, name: "배지민", team: "A", completed: 84,  conversion_rate: 68.8, avg_duration: 19.7, qa_score: 80, period: "MONTH" },
  { interviewer_id: 12, name: "서지안", team: "C", completed: 25,  conversion_rate: 45.5, avg_duration: 29.9, qa_score: 58, period: "DAY" },
  { interviewer_id: 13, name: "강서우", team: "B", completed: 137, conversion_rate: 84.6, avg_duration: 15.9, qa_score: 93, period: "MONTH" },
  { interviewer_id: 14, name: "임다은", team: "A", completed: 45,  conversion_rate: 52.2, avg_duration: 24.8, qa_score: 68, period: "WEEK" },
  { interviewer_id: 15, name: "장하림", team: "C", completed: 102, conversion_rate: 74.9, avg_duration: 18.0, qa_score: 85, period: "MONTH" },
  // 추가 데이터 - 각 기간별로 더 많은 데이터
  { interviewer_id: 16, name: "김철수", team: "A", completed: 95,  conversion_rate: 75.5, avg_duration: 17.2, qa_score: 87, period: "DAY" },
  { interviewer_id: 17, name: "이영희", team: "B", completed: 88,  conversion_rate: 82.3, avg_duration: 16.8, qa_score: 89, period: "DAY" },
  { interviewer_id: 18, name: "박민수", team: "C", completed: 72,  conversion_rate: 68.9, avg_duration: 19.5, qa_score: 76, period: "DAY" },
  { interviewer_id: 19, name: "최수진", team: "A", completed: 105, conversion_rate: 79.1, avg_duration: 16.9, qa_score: 91, period: "WEEK" },
  { interviewer_id: 20, name: "정현우", team: "B", completed: 92,  conversion_rate: 76.8, avg_duration: 18.1, qa_score: 84, period: "WEEK" },
  { interviewer_id: 21, name: "강미영", team: "C", completed: 78,  conversion_rate: 71.2, avg_duration: 20.3, qa_score: 79, period: "WEEK" },
  { interviewer_id: 22, name: "윤태호", team: "A", completed: 135, conversion_rate: 85.4, avg_duration: 15.7, qa_score: 94, period: "MONTH" },
  { interviewer_id: 23, name: "송지은", team: "B", completed: 128, conversion_rate: 81.6, avg_duration: 16.3, qa_score: 90, period: "MONTH" },
  { interviewer_id: 24, name: "임동현", team: "C", completed: 115, conversion_rate: 77.8, avg_duration: 17.8, qa_score: 86, period: "MONTH" },
];

const METRICS = [
  { key: "completed", label: "완료 인터뷰 수" },
  { key: "conversion_rate", label: "응답률 %" },
  { key: "qa_score", label: "품질 점수" },
  { key: "avg_duration", label: "평균 소요시간(분) — 낮을수록 좋음", invert: true },
] as const;

const PERIODS = [
  { key: "DAY", label: "오늘" },
  { key: "WEEK", label: "이번 주" },
  { key: "MONTH", label: "이번 달" },
];

type MetricKey = typeof METRICS[number]["key"];
type PeriodKey = typeof PERIODS[number]["key"];
type Row = (typeof DEMO)[number];

interface RankedRow extends Row {
  value: number;
}

function rankByMetric(rows: Row[], metric: MetricKey, options?: { invert?: boolean; take?: number }) {
  const { invert = false, take = 10 } = options || {};
  const safe = rows
    .filter((r) => Number.isFinite((r as any)[metric]))
    .map((r) => ({ ...r, value: (r as any)[metric] as number }));

  const sorted = safe.sort((a, b) => (invert ? a.value - b.value : b.value - a.value));
  const top = sorted.slice(0, take);
  const bottom = [...sorted].reverse().slice(0, take);
  return { top, bottom };
}

function useRanked(data: Row[], metric: MetricKey) {
  const metricCfg = METRICS.find((m) => m.key === metric)!;
  return useMemo(() => rankByMetric(data, metric, { invert: !!(metricCfg as any).invert, take: 10 }), [data, metric]);
}

// Custom UI Components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-gradient-to-b from-slate-900/60 to-slate-900/30 border border-slate-800 rounded-lg ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const Button: React.FC<{ 
  children: React.ReactNode; 
  variant?: "secondary" | "outline";
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = "secondary", className = "", onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      variant === "secondary" 
        ? "bg-slate-800/70 border border-slate-700 text-slate-200 hover:bg-slate-700/70" 
        : "border border-slate-700 text-slate-200 hover:bg-slate-800/70"
    } ${className}`}
  >
    {children}
  </button>
);

const Input: React.FC<{ 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, placeholder, className = "" }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`px-3 py-2 bg-slate-900/70 border border-slate-700 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600 ${className}`}
  />
);

const Select: React.FC<{ 
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}> = ({ children, value, onValueChange, placeholder }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="px-3 py-2 bg-slate-900/70 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-600 w-full"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {children}
  </select>
);

const SelectTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={className}>
    {children}
  </div>
);

const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
  <span>{placeholder}</span>
);

const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute z-10 mt-1 w-full bg-slate-900 border border-slate-700 rounded-md shadow-lg">
    {children}
  </div>
);

const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => (
  <option value={value} className="px-3 py-2 hover:bg-slate-800 cursor-pointer">
    {children}
  </option>
);

const ChartPanel: React.FC<{ title: React.ReactNode; data: Array<{ name: string; value: number; team?: string }> }> = ({ title, data }) => (
  <Card className="text-slate-100">
    <CardContent>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold tracking-wide opacity-90">{title}</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.2} />
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={90} tick={{ fill: "#cbd5e1", fontSize: 12 }} />
            <Tooltip formatter={(v: number) => v.toLocaleString()} labelStyle={{ color: "#e2e8f0" }} contentStyle={{ background: "#0b1220", border: "1px solid #1f2937" }} />
            <Bar dataKey="value" radius={[8, 8, 8, 8]}>
              <LabelList dataKey="value" position="right" formatter={(v: number) => v.toLocaleString()} style={{ fill: "#e2e8f0", fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const ListPanel: React.FC<{ title: string; rows: RankedRow[] }> = ({ title, rows }) => (
  <Card className="text-slate-100">
    <CardContent>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold tracking-wide opacity-90">{title}</h3>
      </div>
      <ul className="divide-y divide-slate-800/80">
        {rows.map((r, i) => (
          <li key={r.interviewer_id} className="py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-6 text-right text-slate-400">{i + 1}</span>
              <div>
                <div className="font-medium leading-tight">{r.name}</div>
                <div className="text-xs text-slate-400">Team {r.team ?? "-"}</div>
              </div>
            </div>
            <div className="text-sm tabular-nums text-slate-200">
              {r.value.toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const InterviewerRankPage: React.FC = () => {
  const [metric, setMetric] = useState<MetricKey>("completed");
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState<string>("ALL");
  const [period, setPeriod] = useState<PeriodKey>("MONTH");

  const metricCfg = METRICS.find((m) => m.key === metric)!;

  // Filter by search / team / period
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEMO.filter(
      (r) => (team === "ALL" || r.team === team) && (period === r.period) && (q === "" || r.name.toLowerCase().includes(q))
    );
  }, [query, team, period]);

  const ranked = useRanked(filtered, metric);

  const chartTop = ranked.top.map((r) => ({ name: r.name, value: r.value, team: r.team }));
  const chartBottom = ranked.bottom.map((r) => ({ name: r.name, value: r.value, team: r.team }));

  return (
    <div className="w-full p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Interviewer Rank</h1>
            <p className="text-sm text-slate-400">Top 10 / Bottom 10 · {METRICS.find((m) => m.key === metric)?.label}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              <Download className="mr-2 h-4 w-4"/>Export CSV
            </Button>
          </div>
        </header>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="col-span-1">
              <label className="text-xs text-slate-400">Metric</label>
              <Select value={metric} onValueChange={(v) => setMetric(v as MetricKey)} placeholder="지표 선택">
                {METRICS.map((m) => (
                  <SelectItem key={m.key} value={m.key as string}>{m.label}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="col-span-1">
              <label className="text-xs text-slate-400">Team</label>
              <Select value={team} onValueChange={setTeam} placeholder="팀 선택">
                <SelectItem value="ALL">ALL</SelectItem>
                {Array.from(new Set(DEMO.map((d) => d.team))).map((t) => (
                  <SelectItem key={t} value={t!}>Team {t}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="col-span-1">
              <label className="text-xs text-slate-400">기간</label>
              <Select value={period} onValueChange={(v) => setPeriod(v as PeriodKey)} placeholder="기간 선택">
                {PERIODS.map((p) => (
                  <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-400">Search interviewer</label>
              <div className="mt-1 flex">
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="이름 검색" />
                <Button variant="outline" className="ml-2">
                  <Filter className="mr-2 h-4 w-4"/>Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartPanel title={<span className="inline-flex items-center gap-2"><ArrowUpWideNarrow className="h-4 w-4"/>Top 10</span>} data={chartTop} />
          <ChartPanel title={<span className="inline-flex items-center gap-2"><ArrowDownWideNarrow className="h-4 w-4"/>Bottom 10</span>} data={chartBottom} />
        </div>

        {/* Ranked Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <ListPanel title={`Top 10 — ${metricCfg.label}`} rows={ranked.top} />
          <ListPanel title={`Bottom 10 — ${metricCfg.label}`} rows={ranked.bottom} />
        </div>

        {/* Footnote */}
        <p className="mt-6 text-xs text-slate-400">
          * 평균 소요시간(metric: avg_duration)은 낮을수록 좋기 때문에 자동으로 역순(오름차순) 랭킹됩니다.
        </p>
      </motion.div>
    </div>
  );
};

export default InterviewerRankPage;
