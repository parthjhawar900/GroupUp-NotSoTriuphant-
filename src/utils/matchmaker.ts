import { StudentProfile, Team, MatchBreakdown, ProficiencyLevel } from '../types';

const PROFICIENCY_WEIGHTS: Record<ProficiencyLevel, number> = {
  Expert: 1.0,
  Advanced: 0.85,
  Intermediate: 0.65,
  Beginner: 0.4,
};

const AVAILABILITY_HOURS: Record<string, number> = {
  '5-10 hrs/week': 8,
  '10-15 hrs/week': 12.5,
  '15-20 hrs/week': 17.5,
  '20+ hrs/week (Full Sprint)': 25,
};

// Roles that naturally complement each other
const ROLE_COMPLEMENTS: Record<string, string[]> = {
  'Frontend': ['Backend', 'UI/UX Design', 'Full-Stack', 'Product Manager'],
  'Backend': ['Frontend', 'UI/UX Design', 'DevOps / Cloud', 'AI / Machine Learning'],
  'Full-Stack': ['UI/UX Design', 'AI / Machine Learning', 'Product Manager', 'DevOps / Cloud'],
  'AI / Machine Learning': ['Full-Stack', 'Frontend', 'Backend', 'Product Manager'],
  'UI/UX Design': ['Frontend', 'Full-Stack', 'Backend', 'Product Manager'],
  'Product Manager': ['Full-Stack', 'Frontend', 'Backend', 'UI/UX Design'],
  'DevOps / Cloud': ['Backend', 'Full-Stack', 'AI / Machine Learning'],
  'Mobile': ['Backend', 'UI/UX Design', 'Product Manager'],
  'Hardware / Embedded': ['Backend', 'Frontend', 'Mobile', 'UI/UX Design'],
};

/**
 * Calculates compatibility between a candidate student and the current user or an active team.
 */
export function calculateMatchScore(
  candidate: StudentProfile,
  currentUser: StudentProfile,
  activeTeam?: Team | null,
  allTeamMembersProfiles?: StudentProfile[]
): MatchBreakdown {
  // If candidate is the current user, compatibility is not applicable
  if (candidate.id === currentUser.id) {
    return {
      complementarySkillsScore: 0,
      sharedInterestsScore: 0,
      availabilityScore: 0,
      experienceScore: 0,
      totalScore: 0,
      complementarySkills: [],
      sharedInterests: [],
      missingSkillsCovered: [],
      whyRecommended: 'This is your own profile.',
      synergyHighlights: [],
    };
  }

  const candidateSkillNames = new Set(candidate.skills.map((s) => s.name.toLowerCase()));
  const candidateSkillMap = new Map(candidate.skills.map((s) => [s.name.toLowerCase(), s]));

  let complementaryScore = 0;
  const missingSkillsCovered: string[] = [];
  const complementarySkills: string[] = [];

  if (activeTeam && activeTeam.requiredSkills.length > 0) {
    // 1. Team-aware skill gap coverage
    // Determine which required skills are already covered by current team members
    const teamMembers = allTeamMembersProfiles || [currentUser];
    const coveredByTeam = new Set<string>();
    for (const member of teamMembers) {
      for (const skill of member.skills) {
        coveredByTeam.add(skill.name.toLowerCase());
      }
    }

    const missingRequired = activeTeam.requiredSkills.filter(
      (req) => !coveredByTeam.has(req.toLowerCase())
    );

    let coveredMissingCount = 0;
    for (const req of activeTeam.requiredSkills) {
      const lowerReq = req.toLowerCase();
      if (candidateSkillMap.has(lowerReq)) {
        const skill = candidateSkillMap.get(lowerReq)!;
        const weight = PROFICIENCY_WEIGHTS[skill.level];
        if (missingRequired.some((m) => m.toLowerCase() === lowerReq)) {
          // High reward for filling an unmet gap
          coveredMissingCount += weight;
          missingSkillsCovered.push(skill.name);
        } else {
          // Reinforces existing required skill
          coveredMissingCount += weight * 0.4;
          complementarySkills.push(skill.name);
        }
      }
    }

    if (missingRequired.length > 0) {
      // Score primarily based on how well candidate addresses the open gaps
      const gapCoverageRatio = missingSkillsCovered.length > 0
        ? (coveredMissingCount / missingRequired.length) * 85 + 15
        : 25;
      complementaryScore = Math.min(100, Math.round(gapCoverageRatio));
    } else {
      complementaryScore = Math.min(100, Math.round((coveredMissingCount / Math.max(1, activeTeam.requiredSkills.length)) * 100));
    }
  } else {
    // 2. Individual user-to-user complementarity
    const userSkillNames = new Set(currentUser.skills.map((s) => s.name.toLowerCase()));
    
    // Find skills candidate has that user doesn't have
    for (const skill of candidate.skills) {
      if (!userSkillNames.has(skill.name.toLowerCase())) {
        complementarySkills.push(skill.name);
      }
    }

    // Role complementarity boost
    const userComplements = ROLE_COMPLEMENTS[currentUser.primaryRole] || [];
    const isComplementaryRole = userComplements.includes(candidate.primaryRole);

    let rawScore = (complementarySkills.length / Math.max(3, candidate.skills.length)) * 75;
    if (isComplementaryRole) {
      rawScore += 25;
    }
    complementaryScore = Math.min(100, Math.round(rawScore));
  }

  // 3. Shared Interests score (25% weight)
  const userInterests = new Set(currentUser.interests.map((i) => i.toLowerCase()));
  const sharedInterests: string[] = [];
  for (const interest of candidate.interests) {
    if (userInterests.has(interest.toLowerCase())) {
      sharedInterests.push(interest);
    }
  }

  const unionSize = new Set([
    ...currentUser.interests.map((i) => i.toLowerCase()),
    ...candidate.interests.map((i) => i.toLowerCase()),
  ]).size;

  const sharedInterestsScore = unionSize > 0
    ? Math.min(100, Math.round((sharedInterests.length / Math.min(unionSize, 4)) * 100))
    : 50;

  // 4. Availability & Mode Match score (20% weight)
  const userHours = AVAILABILITY_HOURS[currentUser.availability] || 15;
  const candidateHours = AVAILABILITY_HOURS[candidate.availability] || 15;
  const hoursDiff = Math.abs(userHours - candidateHours);
  let availabilityScore = Math.max(20, 100 - hoursDiff * 5.5);

  if (
    currentUser.preferredMode === 'Any' ||
    candidate.preferredMode === 'Any' ||
    currentUser.preferredMode === candidate.preferredMode
  ) {
    availabilityScore = Math.min(100, availabilityScore + 10);
  }

  // 5. Experience compatibility (15% weight)
  const candidateHacks = candidate.hackathonsCount || 0;
  const userHacks = currentUser.hackathonsCount || 0;
  let experienceScore = 70; // Good baseline
  if (candidateHacks > 0 && userHacks > 0) {
    experienceScore = 90;
  }
  if (Math.abs(candidateHacks - userHacks) <= 2) {
    experienceScore = Math.min(100, experienceScore + 10);
  }

  // Weighted Total Score: 40% complementary + 25% interests + 20% availability + 15% experience
  const totalScore = Math.min(
    99,
    Math.max(
      35,
      Math.round(
        complementaryScore * 0.4 +
        sharedInterestsScore * 0.25 +
        availabilityScore * 0.2 +
        experienceScore * 0.15
      )
    )
  );

  // Generate actionable explanation and synergy highlights
  const synergyHighlights: string[] = [];

  if (missingSkillsCovered.length > 0) {
    synergyHighlights.push(`Fills ${missingSkillsCovered.length} open team skill gap${missingSkillsCovered.length > 1 ? 's' : ''}: ${missingSkillsCovered.slice(0, 2).join(', ')}`);
  } else if (complementarySkills.length > 0) {
    synergyHighlights.push(`Brings complementary skills in ${complementarySkills.slice(0, 2).join(' & ')}`);
  }

  if (sharedInterests.length > 0) {
    synergyHighlights.push(`Shares ${sharedInterests.length} project interest${sharedInterests.length > 1 ? 's' : ''} (${sharedInterests.slice(0, 2).join(', ')})`);
  }

  if (hoursDiff <= 5) {
    synergyHighlights.push(`Aligned commitment (${candidate.availability})`);
  }

  if (candidate.primaryRole !== currentUser.primaryRole) {
    synergyHighlights.push(`${candidate.primaryRole} pairs with your ${currentUser.primaryRole}`);
  }

  // Synthesize concise "Why Recommended" sentence
  let whyRecommended = '';
  if (missingSkillsCovered.length > 0) {
    whyRecommended = `Recommended because ${candidate.name.split(' ')[0]} covers your open ${missingSkillsCovered.join(', ')} requirement and shares interest in ${sharedInterests[0] || candidate.interests[0]}.`;
  } else if (candidate.primaryRole !== currentUser.primaryRole && sharedInterests.length > 0) {
    whyRecommended = `Strong ${candidate.primaryRole} partner who balances your ${currentUser.primaryRole} background, with mutual focus on ${sharedInterests.join(' & ')}.`;
  } else if (sharedInterests.length > 0) {
    whyRecommended = `High domain alignment with shared passions in ${sharedInterests.slice(0, 2).join(' and ')} plus compatible ${candidate.availability}.`;
  } else {
    whyRecommended = `Solid skill partner with ${candidate.skills.slice(0, 2).map((s) => s.name).join(' & ')} and ${candidate.hackathonsCount} prior competitions.`;
  }

  return {
    complementarySkillsScore: Math.round(complementaryScore),
    sharedInterestsScore: Math.round(sharedInterestsScore),
    availabilityScore: Math.round(availabilityScore),
    experienceScore: Math.round(experienceScore),
    totalScore,
    complementarySkills,
    sharedInterests,
    missingSkillsCovered,
    whyRecommended,
    synergyHighlights,
  };
}

/**
 * Filter students based on multi-factor search criteria
 */
export interface CandidateFilters {
  searchQuery: string;
  role: string;
  missingTeamSkillsOnly: boolean;
  minCompatibility: number;
  availability: string;
  college: string;
  year: string;
  skillName: string;
}

export function filterCandidates(
  candidates: StudentProfile[],
  currentUser: StudentProfile,
  activeTeam: Team | null,
  filters: CandidateFilters,
  allTeamMembersProfiles?: StudentProfile[]
): { candidate: StudentProfile; match: MatchBreakdown }[] {
  return candidates
    .filter((c) => c.id !== currentUser.id)
    .map((candidate) => {
      const match = calculateMatchScore(candidate, currentUser, activeTeam, allTeamMembersProfiles);
      return { candidate, match };
    })
    .filter(({ candidate, match }) => {
      // Search query across name, skills, interests, college, bio
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = candidate.name.toLowerCase().includes(q);
        const matchesCollege = candidate.college.toLowerCase().includes(q);
        const matchesRole = candidate.primaryRole.toLowerCase().includes(q);
        const matchesSkills = candidate.skills.some((s) => s.name.toLowerCase().includes(q));
        const matchesInterests = candidate.interests.some((i) => i.toLowerCase().includes(q));
        if (!matchesName && !matchesCollege && !matchesRole && !matchesSkills && !matchesInterests) {
          return false;
        }
      }

      // Role filter
      if (filters.role && filters.role !== 'All') {
        if (candidate.primaryRole !== filters.role) {
          return false;
        }
      }

      // Missing team skills only
      if (filters.missingTeamSkillsOnly && activeTeam) {
        if (match.missingSkillsCovered.length === 0) {
          return false;
        }
      }

      // Min compatibility
      if (match.totalScore < filters.minCompatibility) {
        return false;
      }

      // Availability filter
      if (filters.availability && filters.availability !== 'All') {
        if (candidate.availability !== filters.availability) {
          return false;
        }
      }

      // College filter
      if (filters.college && filters.college !== 'All') {
        if (candidate.college !== filters.college) {
          return false;
        }
      }

      // Year filter
      if (filters.year && filters.year !== 'All') {
        if (candidate.year !== filters.year) {
          return false;
        }
      }

      // Specific skill filter
      if (filters.skillName && filters.skillName !== 'All') {
        if (!candidate.skills.some((s) => s.name.toLowerCase() === filters.skillName.toLowerCase())) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => b.match.totalScore - a.match.totalScore);
}
