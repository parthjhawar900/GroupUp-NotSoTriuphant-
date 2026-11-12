import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Opportunity } from '../types';

export const OpportunitiesView: React.FC = () => {
  const {
    opportunities,
    setActiveTab,
    setIsCreateTeamModalOpen,
  } = useApp();

  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allTags = ['All', 'AI / ML', 'ClimateTech', 'Healthcare', 'FinTech', 'General', 'Mobile'];

  const filteredOpportunities = opportunities.filter((opp) => {
    if (selectedTag !== 'All' && !opp.tags.includes(selectedTag)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchDesc = opp.description.toLowerCase().includes(q);
      const matchOrg = opp.organizer.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchOrg) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0e172a] to-[#0B0F19] p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Collegiate Competitions & Hackathons</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Target an Opportunity. Form Your Dream Team.
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Discover upcoming hackathons, innovation challenges, and case competitions. GroupUp
            identifies the exact skill mix required to build a winning team.
          </p>
        </div>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities by title, challenge domain, or host university..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOpportunities.map((opp) => (
          <div
            key={opp.id}
            className="group rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 hover:border-slate-700/80 transition-all p-6 flex flex-col justify-between shadow-xl"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {opp.type}
                </span>

                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                  {opp.deadline}
                </span>
              </div>

              {/* Title & Host */}
              <h3 className="text-lg font-extrabold text-white group-hover:text-blue-300 transition-colors">
                {opp.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{opp.organizer}</p>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">{opp.description}</p>

              {/* Meta Stats Row */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{opp.dates}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{opp.location}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-semibold text-amber-300">{opp.prizePool}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Max {opp.teamSizeMax} per team</span>
                </div>
              </div>

              {/* Recommended Skill Stack */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Recommended Team Roles
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {opp.recommendedRoles.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setActiveTab('discover');
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
              >
                <span>Find Teammates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setIsCreateTeamModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/25 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Form a Team</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
