import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { StudentProfile, Team, TeamInvitation, Opportunity } from '../types';
import { SEED_STUDENTS, SEED_OPPORTUNITIES, INITIAL_TEAMS } from '../data/seedData';

interface AppContextType {
  currentUser: StudentProfile;
  allStudents: StudentProfile[];
  teams: Team[];
  opportunities: Opportunity[];
  activeTeamId: string | null;
  activeTeam: Team | null;
  activeTab: 'discover' | 'opportunities' | 'teams' | 'profile';
  selectedStudentForDetail: StudentProfile | null;
  selectedStudentForInvite: StudentProfile | null;
  isCreateTeamModalOpen: boolean;
  isOnboardingModalOpen: boolean;
  pendingInvitationsForMe: TeamInvitation[];
  incomingInvitationsCount: number;
  // Actions
  switchUser: (studentId: string) => void;
  updateCurrentUser: (updated: Partial<StudentProfile>) => void;
  createTeam: (data: {
    name: string;
    tagline: string;
    description: string;
    opportunityName: string;
    targetSize: number;
    requiredSkills: string[];
    tags: string[];
  }) => Team;
  sendInvitation: (teamId: string, inviteeId: string, role: string, note: string) => void;
  respondToInvitation: (invitationId: string, accept: boolean) => void;
  setActiveTeamId: (teamId: string | null) => void;
  setActiveTab: (tab: 'discover' | 'opportunities' | 'teams' | 'profile') => void;
  setSelectedStudentForDetail: (student: StudentProfile | null) => void;
  setSelectedStudentForInvite: (student: StudentProfile | null) => void;
  setIsCreateTeamModalOpen: (open: boolean) => void;
  setIsOnboardingModalOpen: (open: boolean) => void;
  openCreateTeamWithOpportunity: (opportunity: Opportunity) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_STUDENTS = 'groupup_students_v1';
const STORAGE_KEY_TEAMS = 'groupup_teams_v1';
const STORAGE_KEY_USER_ID = 'groupup_current_user_id_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allStudents, setAllStudents] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      return saved ? JSON.parse(saved) : SEED_STUDENTS;
    } catch {
      return SEED_STUDENTS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER_ID);
      return saved || 'student-you';
    } catch {
      return 'student-you';
    }
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEAMS);
      return saved ? JSON.parse(saved) : INITIAL_TEAMS;
    } catch {
      return INITIAL_TEAMS;
    }
  });

  const [opportunities] = useState<Opportunity[]>(SEED_OPPORTUNITIES);
  const [activeTeamId, setActiveTeamId] = useState<string | null>('team-synapse');
  const [activeTab, setActiveTab] = useState<'discover' | 'opportunities' | 'teams' | 'profile'>('discover');
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentProfile | null>(null);
  const [selectedStudentForInvite, setSelectedStudentForInvite] = useState<StudentProfile | null>(null);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(allStudents));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [allStudents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [teams]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER_ID, currentUserId);
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [currentUserId]);

  const currentUser = useMemo(() => {
    return allStudents.find((s) => s.id === currentUserId) || allStudents[0] || SEED_STUDENTS[0];
  }, [allStudents, currentUserId]);

  const activeTeam = useMemo(() => {
    if (!activeTeamId) return null;
    return teams.find((t) => t.id === activeTeamId) || null;
  }, [teams, activeTeamId]);

  // Compute invitations directed to current logged-in user
  const pendingInvitationsForMe = useMemo(() => {
    const list: TeamInvitation[] = [];
    for (const team of teams) {
      for (const inv of team.invitations) {
        if (inv.inviteeId === currentUser.id && inv.status === 'pending') {
          list.push(inv);
        }
      }
    }
    return list;
  }, [teams, currentUser.id]);

  const switchUser = (studentId: string) => {
    setCurrentUserId(studentId);
    // Auto-select a team led by this student if available
    const userTeam = teams.find((t) => t.leaderId === studentId || t.members.some((m) => m.studentId === studentId));
    setActiveTeamId(userTeam ? userTeam.id : null);
  };

  const updateCurrentUser = (updated: Partial<StudentProfile>) => {
    setAllStudents((prev) =>
      prev.map((student) => {
        if (student.id === currentUser.id) {
          return { ...student, ...updated };
        }
        return student;
      })
    );
  };

  const createTeam = (data: {
    name: string;
    tagline: string;
    description: string;
    opportunityName: string;
    targetSize: number;
    requiredSkills: string[];
    tags: string[];
  }): Team => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      opportunityName: data.opportunityName,
      leaderId: currentUser.id,
      targetSize: data.targetSize,
      requiredSkills: data.requiredSkills,
      members: [
        {
          studentId: currentUser.id,
          role: `${currentUser.primaryRole} (Lead)`,
          joinedAt: new Date().toISOString(),
          isLeader: true,
        },
      ],
      invitations: [],
      createdAt: new Date().toISOString(),
      tags: data.tags,
    };

    setTeams((prev) => [newTeam, ...prev]);
    setActiveTeamId(newTeam.id);
    return newTeam;
  };

  const sendInvitation = (teamId: string, inviteeId: string, role: string, note: string) => {
    const invitee = allStudents.find((s) => s.id === inviteeId);
    const targetTeam = teams.find((t) => t.id === teamId);
    if (!targetTeam || !invitee) return;

    const newInv: TeamInvitation = {
      id: `inv-${Date.now()}`,
      teamId,
      teamName: targetTeam.name,
      inviterId: currentUser.id,
      inviterName: currentUser.name,
      inviteeId,
      inviteeName: invitee.name,
      role: role || 'Teammate',
      note: note || `We'd love for you to join ${targetTeam.name}!`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      opportunityName: targetTeam.opportunityName,
    };

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            invitations: [newInv, ...t.invitations],
          };
        }
        return t;
      })
    );
  };

  const respondToInvitation = (invitationId: string, accept: boolean) => {
    setTeams((prev) =>
      prev.map((t) => {
        const invIndex = t.invitations.findIndex((i) => i.id === invitationId);
        if (invIndex === -1) return t;

        const targetInv = t.invitations[invIndex];
        const updatedInvitations = [...t.invitations];
        updatedInvitations[invIndex] = {
          ...targetInv,
          status: accept ? 'accepted' : 'declined',
        };

        let updatedMembers = [...t.members];
        if (accept) {
          // If already member, don't duplicate
          if (!updatedMembers.some((m) => m.studentId === targetInv.inviteeId)) {
            updatedMembers.push({
              studentId: targetInv.inviteeId,
              role: targetInv.role,
              joinedAt: new Date().toISOString(),
              isLeader: false,
            });
          }
        }

        return {
          ...t,
          invitations: updatedInvitations,
          members: updatedMembers,
        };
      })
    );
  };

  const openCreateTeamWithOpportunity = (opportunity: Opportunity) => {
    setActiveTab('teams');
    setIsCreateTeamModalOpen(true);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY_STUDENTS);
    localStorage.removeItem(STORAGE_KEY_TEAMS);
    localStorage.removeItem(STORAGE_KEY_USER_ID);
    setAllStudents(SEED_STUDENTS);
    setTeams(INITIAL_TEAMS);
    setCurrentUserId('student-you');
    setActiveTeamId('team-synapse');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allStudents,
        teams,
        opportunities,
        activeTeamId,
        activeTeam,
        activeTab,
        selectedStudentForDetail,
        selectedStudentForInvite,
        isCreateTeamModalOpen,
        isOnboardingModalOpen,
        pendingInvitationsForMe,
        incomingInvitationsCount: pendingInvitationsForMe.length,
        switchUser,
        updateCurrentUser,
        createTeam,
        sendInvitation,
        respondToInvitation,
        setActiveTeamId,
        setActiveTab,
        setSelectedStudentForDetail,
        setSelectedStudentForInvite,
        setIsCreateTeamModalOpen,
        setIsOnboardingModalOpen,
        openCreateTeamWithOpportunity,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
