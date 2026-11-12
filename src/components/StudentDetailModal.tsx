import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMatchScore } from '../utils/matchmaker';
import { 
  X, 
  Sparkles, 
  GraduationCap, 
  MapPin, 
  Clock, 
  Send, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Globe, 
  Mail, 
  Trophy, 
  CheckCircle, 
  ShieldCheck, 
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';
import { ProficiencyLevel } from '../types';

export const StudentDetailModal: React.FC = () => {
  const {
    currentUser,
    allStudents,
    activeTeam,
    selectedStudentForDetail,
    setSelectedStudentForDetail,
    setSelectedStudentForInvite,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'match' | 'skills' | 'projects'>('match');

  const candidate = selectedStudentForDetail;

  const teamMembersProfiles = useMemo(() => {
    if (!activeTeam) return [currentUser];
    const memberIds = new Set(activeTeam.members.map((m) => m.studentId));
    return allStudents.filter((s) => memberIds.has(s.id));
  }, [activeTeam, allStudents, currentUser]);

  const match = useMemo(() => {
    if (!candidate) return null;
    return calculateMatchScore(candidate, currentUser, activeTeam, teamMembersProfiles);
  }, [candidate, currentUser, activeTeam, teamMembersProfiles]);

  if (!candidate || !match) return null;

  const renderProficiencyBadge = (level: ProficiencyLevel) => {
    const colors = {
      Expert: 'bg-amber-400/15 text-amber-300 border-amber-500/30',
      Advanced: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      Intermediate: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      Beginner: 'bg-slate-700/50 text-slate-300 border-slate-600',
    }[level];

    return (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${colors}`}>
        {level}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-modal-title"
      >
        {/* Top Header Banner */}
        <div className="h-28 bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 relative p-6 flex justify-end">
          <button
            onClick={() => setSelectedStudentForDetail(null)}
            className="p-1.5 rounded-full bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-950 transition-colors"
            aria-label="Close Profile Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0 -mt-12">
          {/* Avatar & Main Info */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-end gap-4">
              <img
                src={candidate.avatarUrl}
                alt={candidate.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-900 shadow-xl"
              />
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 id="student-modal-title" className="text-xl font-extrabold text-white">
                    {candidate.name}
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {candidate.primaryRole}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    {candidate.college}
                  </span>
                  <span>•</span>
                  <span>{candidate.major} ({candidate.year})</span>
                </div>
              </div>
            </div>

            {/* Quick Invite Button */}
            <button
              onClick={() => {
                setSelectedStudentForDetail(null);
                setSelectedStudentForInvite(candidate);
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Invite to Team</span>
            </button>
          </div>

          {/* Social Links & Privacy Badge */}
          <div className="flex items-center justify-between py-3 text-xs border-b border-slate-800/80">
            <div className="flex items-center gap-3 text-slate-400">
              {candidate.githubUrl && (
                <a
                  href={candidate.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {candidate.linkedinUrl && (
                <a
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
              {candidate.portfolioUrl && (
                <a
                  href={candidate.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Student</span>
            </div>
          </div>

          {/* Subtabs */}
          <div className="flex items-center gap-4 mt-4 border-b border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveSubTab('match')}
              className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
                activeSubTab === 'match'
                  ? 'border-blue-500 text-blue-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Match & Synergy ({match.totalScore}%)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('skills')}
              className={`pb-2.5 border-b-2 transition-all ${
                activeSubTab === 'skills'
                  ? 'border-blue-500 text-blue-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Skills & Experience ({candidate.skills.length})
            </button>

            <button
              onClick={() => setActiveSubTab('projects')}
              className={`pb-2.5 border-b-2 transition-all ${
                activeSubTab === 'projects'
                  ? 'border-blue-500 text-blue-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Projects & Portfolio ({candidate.projects.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeSubTab === 'match' && (
              <div className="space-y-4">
                {/* Score Summary Box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">Compatibility Breakdown</div>
                        <div className="text-[11px] text-slate-400">
                          Matched against {activeTeam ? activeTeam.name : 'your profile'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-amber-400">{match.totalScore}%</span>
                      <span className="text-[10px] text-slate-400 block -mt-1 font-semibold uppercase">Overall</span>
                    </div>
                  </div>

                  {/* 4 Factor Progress Bars */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Complementary Skills (40%)</span>
                        <span className="font-semibold text-slate-200">{match.complementarySkillsScore}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${match.complementarySkillsScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Shared Interests (25%)</span>
                        <span className="font-semibold text-slate-200">{match.sharedInterestsScore}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${match.sharedInterestsScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Availability Alignment (20%)</span>
                        <span className="font-semibold text-slate-200">{match.availabilityScore}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${match.availabilityScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Experience Balance (15%)</span>
                        <span className="font-semibold text-slate-200">{match.experienceScore}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${match.experienceScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why Recommended AI Narrative */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-slate-950 border border-blue-900/40">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300 uppercase tracking-wide mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Match Intelligence & Recommendation Logic</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {match.whyRecommended}
                  </p>

                  <div className="mt-3 space-y-1.5">
                    {match.synergyHighlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Role & Gap Plugs */}
                {match.missingSkillsCovered.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Direct Team Gap Solution</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Adding {candidate.name.split(' ')[0]} to{' '}
                      <span className="font-semibold text-white">{activeTeam?.name}</span> resolves open required
                      skills:
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {match.missingSkillsCovered.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-bold"
                        >
                          ⚡ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'skills' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Verified Skills
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {candidate.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{skill.name}</div>
                          <div className="text-[10px] text-slate-500">{skill.category}</div>
                        </div>
                        {renderProficiencyBadge(skill.level)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Weekly Availability:</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      {candidate.availability}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Preferred Collaboration Mode:</span>
                    <span className="font-semibold text-slate-200">{candidate.preferredMode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Past Hackathons / Competitions:</span>
                    <span className="font-semibold text-amber-400 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" />
                      {candidate.hackathonsCount} Completed
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'projects' && (
              <div className="space-y-3">
                {candidate.projects.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No public showcase projects linked yet.
                  </div>
                ) : (
                  candidate.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{proj.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {proj.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
