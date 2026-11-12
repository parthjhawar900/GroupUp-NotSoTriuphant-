import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, Sparkles, CheckCircle2, ShieldCheck, Users } from 'lucide-react';

export const InviteModal: React.FC = () => {
  const {
    currentUser,
    teams,
    activeTeamId,
    selectedStudentForInvite,
    setSelectedStudentForInvite,
    sendInvitation,
  } = useApp();

  const candidate = selectedStudentForInvite;

  const myTeams = teams.filter(
    (t) => t.leaderId === currentUser.id || t.members.some((m) => m.studentId === currentUser.id)
  );

  const [targetTeamId, setTargetTeamId] = useState<string>(() => {
    if (activeTeamId && myTeams.some((t) => t.id === activeTeamId)) return activeTeamId;
    return myTeams[0]?.id || '';
  });

  const [role, setRole] = useState(() => {
    if (!candidate) return 'Teammate';
    return `${candidate.primaryRole} Lead`;
  });

  const [note, setNote] = useState(() => {
    if (!candidate) return '';
    return `Hey ${candidate.name.split(' ')[0]}! We saw your experience in ${candidate.skills.slice(0, 2).map((s) => s.name).join(' & ')} and would love for you to join our squad!`;
  });

  const [isSuccess, setIsSuccess] = useState(false);

  if (!candidate) return null;

  const targetTeam = teams.find((t) => t.id === targetTeamId) || myTeams[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTeam) return;

    sendInvitation(targetTeam.id, candidate.id, role, note);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedStudentForInvite(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-modal-title"
      >
        <button
          onClick={() => setSelectedStudentForInvite(null)}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close Invitation Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Invitation Dispatched!</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              {candidate.name} has been invited to join <span className="text-blue-300">{targetTeam?.name}</span>.
              You can track the status in the My Teams tab.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <img
                src={candidate.avatarUrl}
                alt={candidate.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700"
              />
              <div>
                <h3 id="invite-modal-title" className="text-base font-extrabold text-white">
                  Invite {candidate.name}
                </h3>
                <div className="text-xs text-slate-400">
                  {candidate.primaryRole} • {candidate.college}
                </div>
              </div>
            </div>

            {myTeams.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                You haven't formed a team yet. Please create a team first from the Teams tab before sending an invitation!
              </div>
            ) : (
              <>
                {/* Select Team */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Target Team
                  </label>
                  <select
                    value={targetTeamId}
                    onChange={(e) => setTargetTeamId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {myTeams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.opportunityName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Role */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Proposed Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Lead UI/UX Designer, ML Engineer"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Personal Note */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Personal Pitch & Project Note
                    </label>
                    <span className="text-[10px] text-blue-400 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Personalized
                    </span>
                  </div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="Tell them why they would be a great fit for your project..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Privacy Reminder */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Invitations require candidate confirmation. Personal contact information remains
                    hidden until the invitation is accepted.
                  </span>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStudentForInvite(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Official Invitation</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
