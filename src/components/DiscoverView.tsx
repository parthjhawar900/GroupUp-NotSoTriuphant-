import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { filterCandidates, CandidateFilters } from '../utils/matchmaker';
import { 
  Search, 
  Sparkles, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Send, 
  Eye, 
  MapPin, 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Users,
  Target,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { ProficiencyLevel } from '../types';

export const DiscoverView: React.FC = () => {
  const {
    currentUser,
    allStudents,
    activeTeam,
    teams,
    setSelectedStudentForDetail,
    setSelectedStudentForInvite,
    setActiveTab,
    setIsCreateTeamModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [missingSkillsOnly, setMissingSkillsOnly] = useState(false);
  const [minCompatibility, setMinCompatibility] = useState(0);
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [collegeFilter, setCollegeFilter] = useState('All');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Determine which team members profiles to supply for gap analysis
  const teamMembersProfiles = useMemo(() => {
    if (!activeTeam) return [currentUser];
    const memberIds = new Set(activeTeam.members.map((m) => m.studentId));
    return allStudents.filter((s) => memberIds.has(s.id));
  }, [activeTeam, allStudents, currentUser]);

  // Determine missing required skills for the active team
  const openTeamGaps = useMemo(() => {
    if (!activeTeam) return [];
    const covered = new Set<string>();
    for (const member of teamMembersProfiles) {
      for (const s of member.skills) {
        covered.add(s.name.toLowerCase());
      }
    }
    return activeTeam.requiredSkills.filter((req) => !covered.has(req.toLowerCase()));
  }, [activeTeam, teamMembersProfiles]);

  const candidateFilters: CandidateFilters = useMemo(
    () => ({
      searchQuery,
      role: selectedRole,
      missingTeamSkillsOnly: missingSkillsOnly,
      minCompatibility,
      availability: availabilityFilter,
      college: collegeFilter,
      year: 'All',
      skillName: 'All',
    }),
    [searchQuery, selectedRole, missingSkillsOnly, minCompatibility, availabilityFilter, collegeFilter]
  );

  const matchedCandidates = useMemo(() => {
    return filterCandidates(
      allStudents,
      currentUser,
      activeTeam,
      candidateFilters,
      teamMembersProfiles
    );
  }, [allStudents, currentUser, activeTeam, candidateFilters, teamMembersProfiles]);

  const allColleges = useMemo(() => {
    const set = new Set(allStudents.map((s) => s.college));
    return Array.from(set);
  }, [allStudents]);

  const rolesList = [
    'All',
    'UI/UX Design',
    'AI / Machine Learning',
    'Full-Stack',
    'Backend',
    'Mobile',
    'DevOps / Cloud',
    'Product Manager',
    'Hardware / Embedded',
  ];

  const renderProficiencyDots = (level: ProficiencyLevel) => {
    const dotsCount = {
      Beginner: 1,
      Intermediate: 2,
      Advanced: 3,
      Expert: 4,
    }[level];

    return (
      <div className="flex items-center gap-0.5" title={`Proficiency: ${level}`}>
        {[1, 2, 3, 4].map((dot) => (
          <span
            key={dot}
            className={`w-1.5 h-1.5 rounded-full ${
              dot <= dotsCount
                ? level === 'Expert'
                  ? 'bg-amber-400'
                  : 'bg-blue-400'
                : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    if (score >= 80) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    return 'text-slate-300 border-slate-700 bg-slate-800/40';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero / Context Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0d1627] to-[#0B0F19] p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Complementary Skill Discovery Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Find Teammates with the Skills You Need.
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            GroupUp matches you with collaborators based on complementary capabilities, shared
            competition ambitions, and verified availability—never random lists.
          </p>

          {/* Active Team Gap Context */}
          {activeTeam ? (
            <div className="mt-5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Target Team:</span>
                    <span className="text-xs font-bold text-white">{activeTeam.name}</span>
                    <span className="text-[11px] text-slate-400">({activeTeam.opportunityName})</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center gap-1.5 flex-wrap mt-0.5">
                    <span className="text-slate-400">Open Gaps:</span>
                    {openTeamGaps.length > 0 ? (
                      openTeamGaps.map((gap) => (
                        <span
                          key={gap}
                          className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold"
                        >
                          ⚡ Need {gap}
                        </span>
                      ))
                    ) : (
                      <span className="text-emerald-400 font-medium">All core skills covered!</span>
                    )}
                  </div>
                </div>
              </div>

              {openTeamGaps.length > 0 && (
                <button
                  onClick={() => setMissingSkillsOnly(!missingSkillsOnly)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    missingSkillsOnly
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {missingSkillsOnly ? '✓ Showing Gap Fillers' : 'Filter Open Gaps Only'}
                </button>
              )}
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <span>Matching against your individual profile:</span>
              <span className="font-semibold text-blue-400">{currentUser.primaryRole}</span>
              <button
                onClick={() => setIsCreateTeamModalOpen(true)}
                className="ml-2 text-blue-400 hover:text-blue-300 underline font-medium"
              >
                Create a team to match against specific gaps →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, skills (e.g. Figma, PyTorch), interests or university..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                aria-label="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors border ${
              showAdvancedFilters || minCompatibility > 0 || availabilityFilter !== 'All' || collegeFilter !== 'All'
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {(minCompatibility > 0 || availabilityFilter !== 'All' || collegeFilter !== 'All') && (
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            )}
          </button>
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {rolesList.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedRole === role
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800/80'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvancedFilters && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Min Compatibility Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-medium text-slate-300">
                <span>Minimum Match Score</span>
                <span className="font-bold text-blue-400">{minCompatibility}%+</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minCompatibility}
                onChange={(e) => setMinCompatibility(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block mb-1.5 font-medium text-slate-300">Time Commitment</label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Availabilities</option>
                <option value="5-10 hrs/week">5-10 hrs/week</option>
                <option value="10-15 hrs/week">10-15 hrs/week</option>
                <option value="15-20 hrs/week">15-20 hrs/week</option>
                <option value="20+ hrs/week (Full Sprint)">20+ hrs/week (Full Sprint)</option>
              </select>
            </div>

            {/* University Filter */}
            <div>
              <label className="block mb-1.5 font-medium text-slate-300">College / University</label>
              <select
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Universities</option>
                {allColleges.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count & Active Status */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <span className="font-bold text-slate-200">{matchedCandidates.length}</span> recommended students
        </span>
        {missingSkillsOnly && (
          <span className="text-amber-400 font-medium flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Filtering for active gap fillers
          </span>
        )}
      </div>

      {/* Candidates List / Grid */}
      {matchedCandidates.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No students found matching your criteria</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try lowering your match threshold or clearing role/gap filters to explore more potential teammates.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRole('All');
              setMissingSkillsOnly(false);
              setMinCompatibility(0);
              setAvailabilityFilter('All');
              setCollegeFilter('All');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {matchedCandidates.map(({ candidate, match }) => (
            <div
              key={candidate.id}
              className="group relative rounded-2xl border border-slate-800/90 bg-slate-900/70 hover:bg-slate-900 hover:border-slate-700/90 transition-all p-5 flex flex-col justify-between shadow-lg shadow-black/20"
            >
              {/* Header: Student Info + Score */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={candidate.avatarUrl}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700 group-hover:ring-blue-500/50 transition-all shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                          {candidate.name}
                        </h3>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {candidate.primaryRole}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                          {candidate.college}
                        </span>
                        <span>•</span>
                        <span>{candidate.year}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Badge */}
                  <div
                    className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border font-bold shrink-0 ${getScoreColor(
                      match.totalScore
                    )}`}
                    title={`Match breakdown: Skills ${match.complementarySkillsScore}%, Interests ${match.sharedInterestsScore}%, Availability ${match.availabilityScore}%, Experience ${match.experienceScore}%`}
                  >
                    <span className="text-base font-extrabold leading-none">{match.totalScore}%</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-90 mt-0.5">
                      Match
                    </span>
                  </div>
                </div>

                {/* Why Recommended AI Explanation Card */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800/90">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-amber-300 tracking-wide uppercase">
                        Why Recommended
                      </div>
                      <p className="text-xs text-slate-200 mt-0.5 leading-snug">
                        {match.whyRecommended}
                      </p>
                    </div>
                  </div>

                  {/* Highlight pills */}
                  {match.missingSkillsCovered.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-amber-400 font-semibold">Plugs Open Team Gap:</span>
                      {match.missingSkillsCovered.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] font-bold"
                        >
                          ⚡ {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {candidate.bio}
                </p>

                {/* Skills with proficiency indicators */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Skills & Proficiency
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skills.slice(0, 5).map((skill) => {
                      const isCoveredGap = match.missingSkillsCovered.includes(skill.name);
                      return (
                        <div
                          key={skill.name}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium border ${
                            isCoveredGap
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                              : 'bg-slate-950 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span>{skill.name}</span>
                          {renderProficiencyDots(skill.level)}
                        </div>
                      );
                    })}
                    {candidate.skills.length > 5 && (
                      <span className="px-2 py-1 rounded-lg text-[11px] text-slate-500 bg-slate-950/50">
                        +{candidate.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Shared Interests & Commitment */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-500">Shared:</span>
                    {match.sharedInterests.length > 0 ? (
                      <span className="text-blue-300 font-medium truncate">
                        {match.sharedInterests.slice(0, 2).join(', ')}
                      </span>
                    ) : (
                      <span className="text-slate-400">Complementary fields</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{candidate.availability.split(' ')[0]} hrs/wk</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedStudentForDetail(candidate)}
                  aria-label={`View Profile & Match for ${candidate.name}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Profile & Match</span>
                </button>

                <button
                  onClick={() => setSelectedStudentForInvite(candidate)}
                  aria-label={`Invite ${candidate.name} to Team`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/25 transition-all hover:shadow-blue-500/35"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Invite to Team</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
