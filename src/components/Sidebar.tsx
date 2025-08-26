import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen,
  BarChart3,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const menuItems = [
    { id: 'interviewer', icon: Users, label: 'Interviewer Rank', active: activePage === 'interviewer' },
    { id: 'project', icon: FolderOpen, label: 'Project Management', active: activePage === 'project' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', active: activePage === 'dashboard' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', active: activePage === 'analytics' },
    { id: 'settings', icon: Settings, label: 'Settings', active: activePage === 'settings' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900/80 to-slate-800/80 border-r border-slate-700 h-screen fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">FUSION SMART</h1>
            <span className="text-orange-400 text-xs">BETA</span>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
