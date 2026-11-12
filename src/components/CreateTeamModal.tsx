import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Users, Target, Sparkles, Check } from 'lucide-react';

export const CreateTeamModal: React.FC = () => {
  const {
    opportunities,
    createTeam,
    isCreateTeamModalOpen,
    setIsCreateTeamModalOpen,
    setActiveTab,
  } = useApp();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [opportunityName, setOpportunityName] = useState(
    opportunities[0]?.title || 'Global AI Hackathon 2026'
  );
  const [targetSize, setTargetSize] = useState(4);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([
    'React',
    'UI/UX Design',
    'Python',
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');

  if (!isCreateTeamModalOpen) return null;

  const popularSkills = [
    'React',
    'TypeScript',
    'Python',
    'UI/UX Design',
    'Figma',
    'PyTorch',
    'Node.js',
    'Go',
    'Docker',
    'Flutter',
    'Product Strategy',
  ];

  const toggleSkill = (skill: string) => {
    if (requiredSkills.includes(skill)) {
      setRequiredSkills(requiredSkills.filter((s) => s !== skill));
    } else {
      setRequiredSkills([...requiredSkills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    if (!requiredSkills.includes(customSkillInput.trim())) {
      setRequiredSkills([...requiredSkills, customSkillInput.trim()]);
    }
    setCustomSkillInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createTeam({
      name: name.trim(),
      tagline: tagline.trim() || 'Building an extraordinary competition entry',
      description: description.trim() || 'Looking for passionate teammates to build and pitch a winning product.',
      opportunityName,
      targetSize,
      requiredSkills,
      tags: ['Hackathon', 'Innovation'],
    });

    setIsCreateTeamModalOpen(false);
    setActiveTab('teams');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-team-title"
      >
        <button
          onClick={() => setIsCreateTeamModalOpen(false)}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close Team Creation Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 id="create-team-title" className="text-base font-extrabold text-white">
              Create a New Team
            </h2>
            <p className="text-xs text-slate-400">
              Set your target hackathon, roster size, and required skill stack.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Team Name */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Team Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Synapse AI, NeuralFlow, Quantum Leap"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">One-line Pitch / Vision</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Autonomous AI study copilot for engineering undergrads"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Target Opportunity */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Target Competition / Event</label>
            <select
              value={opportunityName}
              onChange={(e) => setOpportunityName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              {opportunities.map((opp) => (
                <option key={opp.id} value={opp.title}>
                  {opp.title} ({opp.deadline})
                </option>
              ))}
              <option value="Independent Project / Startup">Independent Project / Startup</option>
              <option value="Campus Capstone">Campus Capstone</option>
            </select>
          </div>

          {/* Target Size */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-300">Target Team Size</label>
              <span className="font-bold text-blue-400">{targetSize} Members</span>
            </div>
            <input
              type="range"
              min="2"
              max="6"
              value={targetSize}
              onChange={(e) => setTargetSize(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Required Skills Matrix Selection */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Required Team Skills (Used for Gap Matching)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {popularSkills.map((skill) => {
                const isSelected = requiredSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                  </button>
                );
              })}
            </div>

            {/* Custom Skill Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Or type custom skill..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
                className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Project Description & Needs</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="What are you building, what stack are you using, and what roles are you looking to fill?"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateTeamModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
            >
              Create Team & Match Candidates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
