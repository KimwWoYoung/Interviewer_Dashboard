import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, Pencil, Trash2, Filter, Download, Plus, X } from "lucide-react";

// 인터뷰어 성능 맵 (평균 소요시간)
const INTERVIEWER_MAP: Record<string, { avg_duration: number }> = {
  김하늘: { avg_duration: 18.3 },
  박지우: { avg_duration: 16.1 },
  이서준: { avg_duration: 22.5 },
  최민서: { avg_duration: 20.4 },
  홍가람: { avg_duration: 15.2 },
  정윤아: { avg_duration: 28.1 },
  신도윤: { avg_duration: 19.1 },
  문태양: { avg_duration: 35.3 },
  오세림: { avg_duration: 21.0 },
  한유진: { avg_duration: 14.8 },
  배지민: { avg_duration: 19.7 },
  서지안: { avg_duration: 29.9 },
  강서우: { avg_duration: 15.9 },
  임다은: { avg_duration: 24.8 },
  장하림: { avg_duration: 18.0 },
  김철수: { avg_duration: 17.2 },
  이영희: { avg_duration: 16.8 },
  박민수: { avg_duration: 19.5 },
  최수진: { avg_duration: 16.9 },
  정현우: { avg_duration: 18.1 },
  강미영: { avg_duration: 20.3 },
  윤태호: { avg_duration: 15.7 },
  송지은: { avg_duration: 16.3 },
  임동현: { avg_duration: 17.8 },
};

// 낮을수록 좋은 지표(평균 소요시간) 기준 랭크/백분위 계산
function computeRanks(map: Record<string, { avg_duration: number }>) {
  const rows = Object.entries(map).map(([name, v]) => ({ name, avg: v.avg_duration }));
  rows.sort((a, b) => a.avg - b.avg); // 낮을수록 상위
  const n = rows.length;
  const rankMap: Record<string, { rank: number; percentile: number; avg: number }> = {};
  rows.forEach((r, i) => {
    const rank = i + 1;
    const percentile = (rank / n) * 100; // 낮을수록 좋음
    rankMap[r.name] = { rank, percentile, avg: r.avg };
  });
  return rankMap;
}

const RANK_MAP = computeRanks(INTERVIEWER_MAP);

// Demo project data
const DEMO_PROJECTS = [
  { id: 1, name: "주한 외국인 관광시장 실태조사", created: "2025-01-01", members: ["김하늘", "박지우"], progress: 87, status: "Success" },
  { id: 2, name: "경남 디자인주도 제조혁신 지원 사업 성과분석 및 만족도 전수조사 용역", created: "2025-02-15", members: ["이서준", "최민서"], progress: 47, status: "In Progress" },
  { id: 3, name: "국내거주동포 실태 조사", created: "2025-03-03", members: ["홍가람"], progress: 100, status: "Success" },
  { id: 4, name: "서울시 디자인 수요조사", created: "2025-03-10", members: ["정윤아", "문태양"], progress: 35, status: "Delayed" },
  { id: 5, name: "신흥시장 항공산업 분석 및 방한여객 조사 용역", created: "2025-04-01", members: ["오세림", "한유진"], progress: 60, status: "In Progress" },
  { id: 6, name: "2025년 디자인산업통계 조사 용역", created: "2025-04-15", members: ["신도윤", "배지민"], progress: 25, status: "In Progress" },
  { id: 7, name: "2025 관광안내소 서비스 모니터링 평가", created: "2025-04-20", members: ["강서우", "임다은"], progress: 95, status: "Success" },
  { id: 8, name: "2025년도 국가이미지 조사", created: "2025-05-01", members: ["장하림", "윤태호"], progress: 15, status: "Delayed" },
];

type Project = typeof DEMO_PROJECTS[number];

function statusColor(status: string) {
  switch (status) {
    case "Success":
      return "text-green-400 bg-green-400/20";
    case "In Progress":
      return "text-blue-400 bg-blue-400/20";
    case "Delayed":
      return "text-red-400 bg-red-400/20";
    default:
      return "text-slate-400 bg-slate-700/20";
  }
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
  variant?: "secondary" | "outline" | "destructive";
  size?: "sm" | "default";
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = "secondary", size = "default", className = "", onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-2"
    } ${
      variant === "secondary" 
        ? "bg-slate-800/70 border border-slate-700 text-slate-200 hover:bg-slate-700/70" 
        : variant === "outline"
        ? "border border-slate-700 text-slate-200 hover:bg-slate-800/70"
        : "bg-red-600 text-white hover:bg-red-700"
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

const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => (
  <option value={value} className="px-3 py-2 hover:bg-slate-800 cursor-pointer">
    {children}
  </option>
);

const Progress: React.FC<{ value: number; className?: string }> = ({ value, className = "" }) => (
  <div className={`w-full bg-slate-700 rounded-full h-2 ${className}`}>
    <div 
      className="h-2 rounded-full transition-all duration-300"
      style={{ 
        width: `${value}%`,
        backgroundColor: value >= 100 ? '#10b981' : value >= 60 ? '#3b82f6' : value >= 30 ? '#f59e0b' : '#ef4444'
      }}
    />
  </div>
);

// 프로젝트 상세 모달 컴포넌트
const ProjectDetailModal: React.FC<{ 
  project: Project | null; 
  onClose: () => void; 
}> = ({ project, onClose }) => {
  const detailRows = useMemo(() => {
    if (!project) return [] as Array<{ name: string; avg?: number; rank?: number; percentile?: number }>;
    return project.members.map((m) => {
      const r = RANK_MAP[m];
      return r ? { name: m, avg: r.avg, rank: r.rank, percentile: r.percentile } : { name: m };
    });
  }, [project]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900/95 border border-slate-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">{project.name}</h2>
            <p className="text-sm text-slate-400">프로젝트 멤버 성능 분석</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-100 mb-4">멤버별 평균 소요시간 랭킹</h3>
            <div className="overflow-x-auto rounded-md border border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/60 text-slate-300">
                  <tr>
                    <th className="text-left py-3 px-4">면접원</th>
                    <th className="text-right py-3 px-4">평균 소요시간(분)</th>
                    <th className="text-right py-3 px-4">랭크</th>
                    <th className="text-right py-3 px-4">순위 % (낮을수록 좋음)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {detailRows.map((r) => (
                    <tr key={r.name} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-medium text-slate-100">{r.name}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-200">
                        {r.avg !== undefined ? r.avg.toFixed(1) : "-"}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-200">
                        {r.rank ?? "-"}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-200">
                        {r.percentile !== undefined ? `${r.percentile.toFixed(1)}%` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-slate-100">{project.members.length}</div>
                <div className="text-sm text-slate-400">총 멤버 수</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {detailRows.filter(r => r.rank && r.rank <= 10).length}
                </div>
                <div className="text-sm text-slate-400">Top 10 랭킹</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {detailRows.length > 0 
                    ? (detailRows.reduce((sum, r) => sum + (r.avg || 0), 0) / detailRows.length).toFixed(1)
                    : "0"
                  }
                </div>
                <div className="text-sm text-slate-400">평균 소요시간(분)</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function ProjectManagementPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEMO_PROJECTS.filter(
      (p) => (statusFilter === "ALL" || p.status === statusFilter) && (q === "" || p.name.toLowerCase().includes(q))
    );
  }, [query, statusFilter]);

  return (
    <div className="w-full p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Project Management</h1>
            <p className="text-sm text-slate-400">프로젝트별 진행 상황과 멤버 현황</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4"/>New Project
            </Button>
            <Button variant="secondary">
              <Download className="mr-2 h-4 w-4"/>Export CSV
            </Button>
          </div>
        </header>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="col-span-1">
              <label className="text-xs text-slate-400">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter} placeholder="상태 선택">
                <SelectItem value="ALL">ALL</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
              </Select>
            </div>
            <div className="col-span-3">
              <label className="text-xs text-slate-400">Search project</label>
              <div className="mt-1 flex">
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="프로젝트명 검색" />
                <Button variant="outline" className="ml-2">
                  <Filter className="mr-2 h-4 w-4"/>Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Table */}
        <Card className="text-slate-100">
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="text-left py-3 px-2">프로젝트명</th>
                  <th className="text-left py-3 px-2">생성일자</th>
                  <th className="text-left py-3 px-2">멤버</th>
                  <th className="text-left py-3 px-2">진행률</th>
                  <th className="text-left py-3 px-2">상태</th>
                  <th className="text-right py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-2 font-medium">{p.name}</td>
                    <td className="py-4 px-2 text-slate-400">{p.created}</td>
                    <td className="py-4 px-2">
                      <div className="flex -space-x-2">
                        {p.members.map((m, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-700 text-[10px] font-semibold border border-slate-800 hover:scale-110 transition-transform"
                            title={m}
                          >
                            {m[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <Progress value={p.progress} className="flex-1" />
                        <span className="text-xs text-slate-300 min-w-[3rem]">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-slate-700 text-slate-200"
                          onClick={() => setSelectedProject(p)}
                        >
                          <Eye className="h-3 w-3 mr-1"/>View
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-700 text-slate-200">
                          <Pencil className="h-3 w-3 mr-1"/>Edit
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-3 w-3 mr-1"/>Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-slate-100">{filtered.length}</div>
              <div className="text-sm text-slate-400">Total Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {filtered.filter(p => p.status === "Success").length}
              </div>
              <div className="text-sm text-slate-400">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {filtered.filter(p => p.status === "In Progress").length}
              </div>
              <div className="text-sm text-slate-400">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {filtered.filter(p => p.status === "Delayed").length}
              </div>
              <div className="text-sm text-slate-400">Delayed</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
      
      {/* 프로젝트 상세 모달 */}
      <ProjectDetailModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
}
