import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DiscoverView } from './components/DiscoverView';
import { TeamsView } from './components/TeamsView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { ProfileView } from './components/ProfileView';
import { StudentDetailModal } from './components/StudentDetailModal';
import { InviteModal } from './components/InviteModal';
import { CreateTeamModal } from './components/CreateTeamModal';
import { Users, Shield, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {activeTab === 'discover' && <DiscoverView />}
        {activeTab === 'opportunities' && <OpportunitiesView />}
        {activeTab === 'teams' && <TeamsView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Global Modals */}
      <StudentDetailModal />
      <InviteModal />
      <CreateTeamModal />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070A12] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-xs">
              G
            </div>
            <span className="font-bold text-white tracking-tight">GroupUp</span>
            <span className="text-slate-500">•</span>
            <span>Find your people. Build something extraordinary.</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('discover')}
              className="hover:text-blue-400 transition-colors"
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className="hover:text-blue-400 transition-colors"
            >
              Opportunities
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className="hover:text-blue-400 transition-colors"
            >
              My Teams
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="hover:text-blue-400 transition-colors"
            >
              Profile
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Collegiate Student Matchmaking</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
