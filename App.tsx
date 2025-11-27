import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, BarChart3, MessageSquare, Menu, X, Rocket, Database, RefreshCw, Briefcase, ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';
import { AnalysisChart } from './components/AnalysisChart';
import { LCTable } from './components/LCTable';
import { ChatBot } from './components/ChatBot';
import { DeploymentModal } from './components/DeploymentModal';
import { DataSourceModal } from './components/DataSourceModal';
import { STATUS_THRESHOLDS, getStatus } from './constants';
import { getQuickStats } from './services/geminiService';
import { DataProvider, useData } from './contexts/DataContext';
import { PerformanceStatus } from './types';

// --- INTERNAL COMPONENTS (Merged to fix import errors) ---

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendColor?: string;
  bgColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, trendColor = "text-green-600", bgColor = "bg-white" }) => {
  return (
    <div className={`${bgColor} rounded-xl shadow-sm border border-slate-100 p-6 flex items-start justify-between transition-all hover:shadow-md`}>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {trend && <p className={`text-xs font-medium mt-2 ${trendColor}`}>{trend}</p>}
      </div>
      <div className="p-3 bg-brand-50 rounded-lg">
        <Icon className="w-6 h-6 text-brand-600" />
      </div>
    </div>
  );
};

const StatusBadge = ({ overall }: { overall: number }) => {
  const status = getStatus(overall);
  const colors = {
    [PerformanceStatus.GOOD]: "bg-green-100 text-green-800 border-green-200",
    [PerformanceStatus.ACCEPTABLE]: "bg-yellow-100 text-yellow-800 border-yellow-200",
    [PerformanceStatus.POOR]: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colors[status]}`}>
      {overall}% ({status})
    </span>
  );
};

const OrgView: React.FC = () => {
  const { managers } = useData();
  const [expandedMgr, setExpandedMgr] = useState<string | null>(null);

  const toggleMgr = (name: string) => {
    setExpandedMgr(expandedMgr === name ? null : name);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-brand-600" />
        Organizational Hierarchy
      </h2>
      <div className="space-y-3">
        {managers.map((mgr) => (
          <div key={mgr.name} className="border border-slate-100 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleMgr(mgr.name)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedMgr === mgr.name ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                <div className="flex flex-col items-start">
                   <span className="font-semibold text-slate-800 flex items-center gap-2">
                     <Briefcase className="w-4 h-4 text-slate-500" /> {mgr.name}
                   </span>
                   <span className="text-xs text-slate-500">Manager</span>
                </div>
              </div>
              <StatusBadge overall={mgr.metrics.overall} />
            </button>
            
            {expandedMgr === mgr.name && (
              <div className="p-4 bg-white border-t border-slate-100 space-y-2">
                {mgr.tls.length === 0 ? (
                  <p className="text-sm text-slate-400 italic px-4">No direct TLs found.</p>
                ) : (
                  mgr.tls.map((tl) => (
                    <div key={tl.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 ml-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-1.5 rounded-full border border-slate-200">
                          <Users className="w-4 h-4 text-brand-500" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-slate-700">{tl.name}</p>
                           <p className="text-xs text-slate-500">{tl.lcs.length} LCs</p>
                        </div>
                      </div>
                      <StatusBadge overall={tl.metrics.overall} />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
      active 
      ? 'bg-brand-50 text-brand-700' 
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-brand-600' : 'text-slate-400'}`} />
    {label}
  </button>
);

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const { allLCs, allTLs, managers, isUsingLive, lastUpdated, refreshData, isLoading } = useData();

  // Calculate High Level Metrics
  const totalLCs = allLCs.length;
  const activeLCs = allLCs.filter(lc => lc.metrics.attendance === 'Present' || lc.metrics.attendance === 'Active').length;
  const defaulters = allLCs.filter(lc => lc.metrics.overall < STATUS_THRESHOLDS.POOR_LIMIT).length;
  const goodPerformers = allLCs.filter(lc => lc.metrics.overall > STATUS_THRESHOLDS.GOOD_START).length;

  useEffect(() => {
    if (allLCs.length > 0) {
      getQuickStats({ managers, tls: allTLs, lcs: allLCs }).then(setAiSummary);
    }
  }, [allLCs, managers, allTLs]);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">ProdView</h1>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Overview" 
              active={activeTab === 'dashboard'} 
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
            />
            <SidebarItem 
              icon={Users} 
              label="Team Details" 
              active={activeTab === 'details'} 
              onClick={() => { setActiveTab('details'); setIsSidebarOpen(false); }} 
            />
            <SidebarItem 
              icon={MessageSquare} 
              label="AI Analyst" 
              active={activeTab === 'ai'} 
              onClick={() => { setActiveTab('ai'); setIsSidebarOpen(false); }} 
            />
          </nav>

          <div className="p-4 border-t border-slate-100 space-y-3">
             <button 
               onClick={() => setShowSourceModal(true)}
               className="flex items-center gap-2 w-full px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm font-medium"
             >
                <Database className="w-4 h-4" />
                {isUsingLive ? 'Manage Sheet' : 'Connect Sheet'}
             </button>

             <button 
               onClick={() => setShowDeployModal(true)}
               className="flex items-center gap-2 w-full px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
             >
                <Rocket className="w-4 h-4" />
                Deploy App
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-900">ProdView</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Header Info Bar */}
          <div className="mb-6 flex items-center justify-between">
              <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {activeTab === 'dashboard' ? 'Overview' : activeTab === 'details' ? 'Team Details' : 'AI Analysis'}
                  </h2>
                  <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                    Source: {isUsingLive ? <span className="text-green-600 font-medium flex items-center gap-1"><Database className="w-3 h-3"/> Live Sheet</span> : <span className="text-slate-400">Demo Data</span>}
                    {lastUpdated && <span className="text-slate-400">• Updated {lastUpdated.toLocaleTimeString()}</span>}
                  </p>
              </div>
              {isUsingLive && (
                  <button 
                    onClick={refreshData}
                    disabled={isLoading}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
              )}
          </div>

          {/* AI Banner */}
          {aiSummary && (
            <div className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-start gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wide opacity-90 mb-1">Daily AI Brief</h3>
                        <div className="text-sm font-medium leading-relaxed opacity-95">
                           {aiSummary}
                        </div>
                    </div>
                </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard 
                  title="Total LCs" 
                  value={totalLCs} 
                  icon={Users} 
                  trend={`${activeLCs} Active Today`}
                />
                <StatsCard 
                  title="Defaulters (<80%)" 
                  value={defaulters} 
                  icon={X} 
                  trendColor="text-red-500"
                  trend="Requires Attention"
                  bgColor="bg-red-50/50"
                />
                <StatsCard 
                  title="Top Performers (>100%)" 
                  value={goodPerformers} 
                  icon={Rocket} 
                  trendColor="text-green-600"
                  trend="Excellent Work"
                />
                 <StatsCard 
                  title="Acceptable (80-100%)" 
                  value={totalLCs - defaulters - goodPerformers} 
                  icon={LayoutDashboard} 
                  trendColor="text-yellow-600"
                  trend="On Track"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <AnalysisChart />
                 <OrgView />
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
               <LCTable />
            </div>
          )}

          {activeTab === 'ai' && (
             <div className="max-w-4xl mx-auto h-full">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-2">Detailed Analysis</h2>
                    <p className="text-slate-500">
                        Ask deep questions about the data. Powered by Gemini 3 Pro (Reasoning Model).
                    </p>
                </div>
                <ChatBot />
             </div>
          )}
        </div>
      </main>

      <DeploymentModal isOpen={showDeployModal} onClose={() => setShowDeployModal(false)} />
      <DataSourceModal isOpen={showSourceModal} onClose={() => setShowSourceModal(false)} />
    </div>
  );
};

export default function App() {
    return (
        <DataProvider>
            <AppContent />
        </DataProvider>
    );
}