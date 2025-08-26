import React, { useState } from 'react';
import Sidebar from './components/Sidebar.tsx';
import InterviewerRankPage from './InterviewerRankPage.tsx';
import ProjectManagementPage from './ProjectManagementPage.tsx';

function App() {
  const [activePage, setActivePage] = useState('interviewer');

  const renderPage = () => {
    switch (activePage) {
      case 'interviewer':
        return <InterviewerRankPage />;
      case 'project':
        return <ProjectManagementPage />;
      case 'dashboard':
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-slate-100 mb-2">Dashboard</h2>
              <p className="text-slate-400">Coming soon...</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-slate-100 mb-2">Analytics</h2>
              <p className="text-slate-400">Coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-slate-100 mb-2">Settings</h2>
              <p className="text-slate-400">Coming soon...</p>
            </div>
          </div>
        );
      default:
        return <InterviewerRankPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-sky-950 via-slate-950 to-slate-950">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <div className="flex-1 ml-64 overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
