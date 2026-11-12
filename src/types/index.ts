export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface StudentSkill {
  name: string;
  category: 'Technical' | 'Design' | 'Product' | 'Domain';
  level: ProficiencyLevel;
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  role: string;
}

export type AvailabilityTier = '5-10 hrs/week' | '10-15 hrs/week' | '15-20 hrs/week' | '20+ hrs/week (Full Sprint)';
export type PreferredMode = 'Remote' | 'Hybrid' | 'In-Person' | 'Any';

export interface StudentProfile {
  id: string;
  name: string;
  avatarUrl: string;
  college: string;
  major: string;
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Master / Grad';
  graduationYear: number;
  bio: string;
  primaryRole: 'Frontend' | 'Backend' | 'Full-Stack' | 'AI / Machine Learning' | 'UI/UX Design' | 'Product Manager' | 'DevOps / Cloud' | 'Mobile' | 'Hardware / Embedded';
  skills: StudentSkill[];
  interests: string[];
  availability: AvailabilityTier;
  preferredMode: PreferredMode;
  collaborationGoals: string[];
  projects: StudentProject[];
  hackathonsCount: number;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  email: string;
  privacySettings: {
    isProfilePublic: boolean;
    showContactToAcceptedOnly: boolean;
  };
}

export interface TeamMember {
  studentId: string;
  role: string;
  joinedAt: string;
  isLeader: boolean;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  inviterId: string;
  inviterName: string;
  inviteeId: string;
  inviteeName: string;
  role: string;
  note: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  opportunityName?: string;
}

export interface Team {
  id: string;
  name: string;
  tagline: string;
  description: string;
  opportunityId?: string;
  opportunityName: string;
  leaderId: string;
  targetSize: number;
  requiredSkills: string[];
  members: TeamMember[];
  invitations: TeamInvitation[];
  createdAt: string;
  tags: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  organizer: string;
  type: 'Hackathon' | 'Competition' | 'Case Study' | 'Open Source Sprint';
  deadline: string;
  dates: string;
  location: string;
  prizePool: string;
  teamSizeMax: number;
  description: string;
  tags: string[];
  recommendedRoles: string[];
  bannerGradient: string;
  websiteUrl?: string;
}

export interface MatchBreakdown {
  complementarySkillsScore: number; // 0 - 100 (40% weight)
  sharedInterestsScore: number;      // 0 - 100 (25% weight)
  availabilityScore: number;          // 0 - 100 (20% weight)
  experienceScore: number;            // 0 - 100 (15% weight)
  totalScore: number;                 // 0 - 100
  complementarySkills: string[];
  sharedInterests: string[];
  missingSkillsCovered: string[];
  whyRecommended: string;
  synergyHighlights: string[];
}
