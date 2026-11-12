import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  Edit3, 
  Save, 
  Lock, 
  Eye, 
  Github, 
  Linkedin, 
  Globe, 
  Mail,
  Trophy
} from 'lucide-react';
import { ProficiencyLevel, StudentSkill, AvailabilityTier, PreferredMode } from '../types';

export const ProfileView: React.FC = () => {
  const { currentUser, updateCurrentUser } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(currentUser);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<ProficiencyLevel>('Intermediate');
  const [newSkillCategory, setNewSkillCategory] = useState<'Technical' | 'Design' | 'Product' | 'Domain'>('Technical');
  const [newInterest, setNewInterest] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  // Sync formData if currentUser changed externally (e.g. via persona switcher)
  React.useEffect(() => {
    setFormData(currentUser);
    setIsEditing(false);
  }, [currentUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser(formData);
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    if (formData.skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return;

    const newSkill: StudentSkill = {
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
    };

    setFormData({
      ...formData,
      skills: [...formData.skills, newSkill],
    });
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s.name !== skillName),
    });
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    if (formData.interests.includes(newInterest.trim())) return;

    setFormData({
      ...formData,
      interests: [...formData.interests, newInterest.trim()],
    });
    setNewInterest('');
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-2xl shadow-emerald-600/30">
          <Check className="w-4 h-4" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="h-32 bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 p-6 flex justify-end items-start">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              isEditing
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                : 'bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700'
            }`}
          >
            {isEditing ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Cancel Editing</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Profile Details */}
        <div className="px-6 pb-6 pt-0 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-end gap-4">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-900 shadow-xl"
              />
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-extrabold text-white">{currentUser.name}</h1>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {currentUser.primaryRole}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    {currentUser.college}
                  </span>
                  <span>•</span>
                  <span>{currentUser.major} ({currentUser.year})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentUser.availability}</span>
              <span>•</span>
              <span>{currentUser.preferredMode}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed max-w-2xl">
            {currentUser.bio}
          </p>
        </div>
      </div>

      {isEditing ? (
        /* Edit Form */
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Academic & General Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Primary Role</label>
                <select
                  value={formData.primaryRole}
                  onChange={(e) => setFormData({ ...formData, primaryRole: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="Full-Stack">Full-Stack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="AI / Machine Learning">AI / Machine Learning</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="DevOps / Cloud">DevOps / Cloud</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Hardware / Embedded">Hardware / Embedded</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">College / University</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Academic Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Master / Grad">Master / Grad</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Bio & Teammate Vision</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>
          </div>

          {/* Availability & Mode */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Availability & Collaboration Mode
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Weekly Time Commitment</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value as AvailabilityTier })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="5-10 hrs/week">5-10 hrs/week</option>
                  <option value="10-15 hrs/week">10-15 hrs/week</option>
                  <option value="15-20 hrs/week">15-20 hrs/week</option>
                  <option value="20+ hrs/week (Full Sprint)">20+ hrs/week (Full Sprint)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Preferred Collaboration Mode</label>
                <select
                  value={formData.preferredMode}
                  onChange={(e) => setFormData({ ...formData, preferredMode: e.target.value as PreferredMode })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Any">Any</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skill Manager */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Skills & Proficiency Levels
            </h3>

            {/* Existing Skills */}
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <span className="font-semibold text-white">{skill.name}</span>
                  <span className="text-[10px] text-blue-400">({skill.level})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.name)}
                    className="ml-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Row */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <input
                type="text"
                placeholder="Skill name (e.g. Next.js, Figma, Rust)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />

              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value as any)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300"
              >
                <option value="Technical">Technical</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Domain">Domain</option>
              </select>

              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value as any)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>

              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>

          {/* Privacy Controls */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Privacy & Contact Visibility</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">Public Discovery Profile</span>
                  <span className="text-[11px] text-slate-400">
                    Allow other verified students to discover you in recommendations.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.privacySettings.isProfilePublic}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      privacySettings: {
                        ...formData.privacySettings,
                        isProfilePublic: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-blue-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">Hide Contact Info Until Accepted</span>
                  <span className="text-[11px] text-slate-400">
                    Your email and direct contact handles will only be revealed to confirmed teammates.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.privacySettings.showContactToAcceptedOnly}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      privacySettings: {
                        ...formData.privacySettings,
                        showContactToAcceptedOnly: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-blue-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setFormData(currentUser);
                setIsEditing(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      ) : (
        /* Read-Only Profile View */
        <div className="space-y-6">
          {/* Skills Grid */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Skills & Verified Proficiencies
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentUser.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{skill.name}</span>
                    <span className="text-[10px] text-slate-500">{skill.category}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      skill.level === 'Expert'
                        ? 'bg-amber-400/20 text-amber-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interests & Goals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Project & Challenge Interests
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.interests.map((i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-medium"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Collaboration Goals
              </h3>
              <div className="space-y-1.5 text-xs text-slate-300">
                {currentUser.collaborationGoals.map((goal, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Past Projects */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Showcase Projects
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUser.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{proj.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                        {proj.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
