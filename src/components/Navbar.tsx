import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Compass, 
  Trophy, 
  User, 
  Plus, 
  Bell, 
  ChevronDown, 
  Check, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    allStudents,
    teams,
    activeTeamId,
    activeTeam,
    activeTab,
    pendingInvitationsForMe,
    switchUser,
    setActiveTeamId,
    setActiveTab,
    setIsCreateTeamModalOpen,
  } = useApp();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const teamDropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target as Node)) {
        setIsTeamDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const myTeams = teams.filter(
    (t) => t.leaderId === currentUser.id || t.members.some((m) => m.studentId === currentUser.id)
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('discover')}
              className="flex items-center gap-2.5 text-left group transition-all"
              aria-label="GroupUp Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-white">GroupUp</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Beta
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block -mt-0.5">
                  Find your people. Build something extraordinary.
                </p>
              </div>
            </button>

            {/* Navigation Tabs (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 ml-2" aria-label="Main Navigation">
              <button
                onClick={() => setActiveTab('discover')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'discover'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Discover</span>
              </button>

              <button
                onClick={() => setActiveTab('opportunities')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'opportunities'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Opportunities</span>
              </button>

              <button
                onClick={() => setActiveTab('teams')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                  activeTab === 'teams'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>My Teams</span>
                {pendingInvitationsForMe.length > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                    {pendingInvitationsForMe.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* Active Team Selector Badge */}
            <div className="relative hidden lg:block" ref={teamDropdownRef}>
              <button
                onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs transition-all text-slate-200"
                aria-label="Select Active Team Context"
              >
                <span className="text-slate-400">Team focus:</span>
                <span className="font-semibold text-blue-400 max-w-[130px] truncate">
                  {activeTeam ? activeTeam.name : 'Personal Match'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isTeamDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50">
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Match Candidates For
                  </div>
                  <button
                    onClick={() => {
                      setActiveTeamId(null);
                      setIsTeamDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                      activeTeamId === null
                        ? 'bg-blue-600/20 text-blue-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-medium">1-on-1 Individual Match</div>
                      <div className="text-[10px] text-slate-400">Match based on your personal profile</div>
                    </div>
                    {activeTeamId === null && <Check className="w-4 h-4 text-blue-400" />}
                  </button>

                  {myTeams.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTeamId(t.id);
                        setIsTeamDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs mt-1 transition-colors ${
                        activeTeamId === t.id
                          ? 'bg-blue-600/20 text-blue-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-200">{t.name}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                          {t.opportunityName}
                        </div>
                      </div>
                      {activeTeamId === t.id && <Check className="w-4 h-4 text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Create Team CTA Button */}
            <button
              onClick={() => setIsCreateTeamModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition-all hover:shadow-blue-500/35"
              aria-label="Create Team"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Team</span>
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                aria-label={`Notifications ${pendingInvitationsForMe.length > 0 ? `(${pendingInvitationsForMe.length} new)` : ''}`}
              >
                <Bell className="w-5 h-5" />
                {pendingInvitationsForMe.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-[#0B0F19]" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200">Invitations & Alerts</span>
                    <span className="text-[11px] text-blue-400 font-medium">
                      {pendingInvitationsForMe.length} Pending
                    </span>
                  </div>

                  {pendingInvitationsForMe.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No pending team invitations.
                    </div>
                  ) : (
                    <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                      {pendingInvitationsForMe.map((inv) => (
                        <div
                          key={inv.id}
                          className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">{inv.teamName}</span>
                            <span className="text-[10px] text-amber-400 font-medium px-1.5 py-0.5 rounded bg-amber-400/10">
                              Invite
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 line-clamp-2">
                            {inv.inviterName} invited you to join as <span className="text-blue-300">{inv.role}</span>.
                          </p>
                          <button
                            onClick={() => {
                              setActiveTab('teams');
                              setIsNotifOpen(false);
                            }}
                            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 pt-1"
                          >
                            <span>View details & respond</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Persona Switcher / User Profile Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-left"
                aria-label={`Current User: ${currentUser.name}`}
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/40"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                    <span className="max-w-[90px] truncate">{currentUser.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 -mt-0.5 max-w-[90px] truncate">
                    {currentUser.primaryRole}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1.5">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Student Persona
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Test multi-user matchmaking & incoming team invites.
                    </p>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {allStudents.map((student) => {
                      const isSelected = student.id === currentUser.id;
                      return (
                        <button
                          key={student.id}
                          onClick={() => {
                            switchUser(student.id);
                            setIsUserDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs transition-colors ${
                            isSelected
                              ? 'bg-blue-600/20 text-white font-medium border border-blue-500/30'
                              : 'text-slate-300 hover:bg-slate-800/80'
                          }`}
                        >
                          <img
                            src={student.avatarUrl}
                            alt={student.name}
                            className="w-7 h-7 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-100 truncate">
                                {student.name}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] text-blue-400 font-bold px-1.5 py-0.2 rounded bg-blue-500/10">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {student.primaryRole} • {student.college.split(' ')[0]}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-center py-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 rounded-lg hover:bg-blue-500/10 transition-colors"
                    >
                      View & Edit Profile Settings
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden border-t border-slate-800/80 bg-[#0B0F19]/95 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'discover' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Discover</span>
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'opportunities' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Opportunities</span>
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors relative ${
            activeTab === 'teams' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <div className="relative">
            <Users className="w-4 h-4" />
            {pendingInvitationsForMe.length > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-amber-500 text-[9px] font-bold text-slate-950 flex items-center justify-center">
                {pendingInvitationsForMe.length}
              </span>
            )}
          </div>
          <span>Teams</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'profile' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>
    </header>
  );
};
