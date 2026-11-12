import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Plus, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Mail, 
  Send, 
  Check, 
  X, 
  Sparkles, 
  Search, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const TeamsView: React.FC = () => {
  const {
    currentUser,
    allStudents,
    teams,
    activeTeamId,
    setActiveTeamId,
    setIsCreateTeamModalOpen,
    setActiveTab,
    pendingInvitationsForMe,
    respondToInvitation,
  } = useApp();

  const myTeams = useMemo(() => {
    return teams.filter(
      (t) => t.leaderId === currentUser.id || t.members.some((m) => m.studentId === currentUser.id)
    );
  }, [teams, currentUser.id]);

  const [selectedTeamId, setSelectedTeamId] = useState<string>(() => {
    if (activeTeamId && myTeams.some((t) => t.id === activeTeamId)) return activeTeamId;
    return myTeams[0]?.id || '';
  });

  // Keep selected team in sync with activeTeamId if it changes
  const currentTeam = useMemo(() => {
    return teams.find((t) => t.id === selectedTeamId) || myTeams[0] || teams[0];
  }, [teams, selectedTeamId, myTeams]);

  // Profiles of current team members
  const memberProfiles = useMemo(() => {
    if (!currentTeam) return [];
    return currentTeam.members.map((m) => {
      const profile = allStudents.find((s) => s.id === m.studentId);
      return { member: m, profile };
    });
  }, [currentTeam, allStudents]);

  // Skill Gap Analysis: evaluate requiredSkills against members' skills
  const skillGapAnalysis = useMemo(() => {
    if (!currentTeam) return [];
    return currentTeam.requiredSkills.map((reqSkill) => {
      const coveringMembers = memberProfiles.filter(({ profile }) =>
        profile?.skills.some((s) => s.name.toLowerCase() === reqSkill.toLowerCase())
      );

      const isCovered = coveringMembers.length > 0;
      const bestLevel = isCovered
        ? coveringMembers[0].profile?.skills.find(
            (s) => s.name.toLowerCase() === reqSkill.toLowerCase()
          )?.level || 'Intermediate'
        : null;

      return {
        skillName: reqSkill,
        isCovered,
        coveringMembers,
        bestLevel,
      };
    });
  }, [currentTeam, memberProfiles]);

  const coveredCount = skillGapAnalysis.filter((g) => g.isCovered).length;
  const missingCount = skillGapAnalysis.length - coveredCount;

  return (
    <div className="space-y-6 pb-12">
      {/* Incoming Invitations Banner (if any) */}
      {pendingInvitationsForMe.length > 0 && (
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 p-5 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Incoming Team Collaboration Invitations ({pendingInvitationsForMe.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {pendingInvitationsForMe.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{inv.teamName}</span>
                    <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                      Pending Your Decision
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Target Event: <span className="text-slate-200">{inv.opportunityName || 'Hackathon'}</span>
                  </div>
                  <div className="text-xs text-blue-300 font-medium mt-1">
                    Offered Role: {inv.role}
                  </div>
                  <p className="text-xs text-slate-300 italic mt-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    "{inv.note}"
                  </p>
                  <div className="text-[10px] text-slate-500 mt-2">
                    Invited by {inv.inviterName}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => respondToInvitation(inv.id, true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Invitation</span>
                  </button>

                  <button
                    onClick={() => respondToInvitation(inv.id, false)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Team Management Shell */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Team Command Center</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Monitor skill coverage, plug open vacancies, and manage candidate invitations.
          </p>
        </div>

        <button
          onClick={() => setIsCreateTeamModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Team</span>
        </button>
      </div>

      {/* Team Selection Tabs */}
      {myTeams.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
          {myTeams.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTeamId(t.id);
                setActiveTeamId(t.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 ${
                currentTeam?.id === t.id
                  ? 'border-blue-500 text-blue-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                {t.members.length}/{t.targetSize}
              </span>
            </button>
          ))}
        </div>
      )}

      {currentTeam ? (
        <div className="space-y-6">
          {/* Team Overview Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0B0F19] border border-slate-800 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-extrabold text-white">{currentTeam.name}</h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {currentTeam.opportunityName}
                  </span>
                  {currentTeam.leaderId === currentUser.id && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      Team Leader
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-medium mt-1">{currentTeam.tagline}</p>
                <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  {currentTeam.description}
                </p>
              </div>

              {/* Roster Progress */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0 min-w-[200px]">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-400">Target Size</span>
                  <span className="font-bold text-white">
                    {currentTeam.members.length} of {currentTeam.targetSize} Confirmed
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (currentTeam.members.length / currentTeam.targetSize) * 100)}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-2 flex justify-between">
                  <span>Open Spots:</span>
                  <span className="text-amber-400 font-bold">
                    {Math.max(0, currentTeam.targetSize - currentTeam.members.length)} remaining
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Gap Matrix & Coverage Radar */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white">Team Skill Gap Matrix</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time audit of required skills versus confirmed member abilities.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">
                  <span className="font-bold text-emerald-400">{coveredCount}</span> covered /{' '}
                  <span className="font-bold text-amber-400">{missingCount}</span> open gaps
                </span>
                {missingCount > 0 && (
                  <button
                    onClick={() => {
                      setActiveTeamId(currentTeam.id);
                      setActiveTab('discover');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
                  >
                    <span>Find Gap Fillers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {skillGapAnalysis.map(({ skillName, isCovered, coveringMembers, bestLevel }) => (
                <div
                  key={skillName}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
                    isCovered
                      ? 'bg-slate-950/80 border-emerald-500/30'
                      : 'bg-amber-500/5 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{skillName}</span>
                    {isCovered ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" /> Covered
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        <AlertCircle className="w-3 h-3" /> Missing
                      </span>
                    )}
                  </div>

                  {isCovered ? (
                    <div className="text-[11px] text-slate-300">
                      <div>
                        Covered by:{' '}
                        <span className="font-semibold text-slate-100">
                          {coveringMembers.map((m) => m.profile?.name.split(' ')[0]).join(', ')}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Highest Proficiency: <span className="text-emerald-300 font-medium">{bestLevel}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[11px] text-slate-400">No member currently possesses this skill.</div>
                      <button
                        onClick={() => {
                          setActiveTeamId(currentTeam.id);
                          setActiveTab('discover');
                        }}
                        className="mt-2 w-full py-1.5 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Search className="w-3 h-3" />
                        <span>Find {skillName} Candidate</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Confirmed Members Roster */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Confirmed Team Roster ({memberProfiles.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {memberProfiles.map(({ member, profile }) => {
                if (!profile) return null;
                const isUser = profile.id === currentUser.id;
                return (
                  <div
                    key={member.studentId}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{profile.name}</span>
                          {member.isLeader && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                              Leader
                            </span>
                          )}
                          {isUser && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-blue-400 font-medium">{member.role}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {profile.college} • {profile.availability}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </span>
                      {profile.email && (
                        <a
                          href={`mailto:${profile.email}`}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white mt-2"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Contact</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outgoing Invitations Tracker */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                <span>Sent Invitations Tracker ({currentTeam.invitations.length})</span>
              </h3>

              <button
                onClick={() => {
                  setActiveTeamId(currentTeam.id);
                  setActiveTab('discover');
                }}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Invite candidates from Discover</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {currentTeam.invitations.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No active invitations sent yet. Discover candidates and send invitations to fill open spots.
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentTeam.invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{inv.inviteeName}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-blue-300 font-medium">Invited as {inv.role}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 italic">"{inv.note}"</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Sent on {new Date(inv.createdAt).toLocaleDateString()} by {inv.inviterName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          inv.status === 'accepted'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : inv.status === 'declined'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">You haven’t formed or joined a team yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Create a team for an upcoming hackathon or competition to unlock intelligent skill gap matching.
          </p>
          <button
            onClick={() => setIsCreateTeamModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30"
          >
            Create Your First Team
          </button>
        </div>
      )}
    </div>
  );
};
