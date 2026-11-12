import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMatchScore, filterCandidates } from './matchmaker';
import { StudentProfile, Team } from '../types';

const mockUser: StudentProfile = {
  id: 'user-1',
  name: 'Alex Chen',
  avatarUrl: '',
  college: 'UC Berkeley',
  major: 'Computer Science',
  year: 'Junior',
  graduationYear: 2027,
  bio: 'Full-stack builder passionate about AI and education.',
  primaryRole: 'Full-Stack',
  skills: [
    { name: 'React', category: 'Technical', level: 'Expert' },
    { name: 'TypeScript', category: 'Technical', level: 'Advanced' },
    { name: 'Node.js', category: 'Technical', level: 'Advanced' },
  ],
  interests: ['AI / Machine Learning', 'EdTech', 'Open Source'],
  availability: '15-20 hrs/week',
  preferredMode: 'Hybrid',
  collaborationGoals: ['Win a major collegiate hackathon', 'Publish open source'],
  projects: [],
  hackathonsCount: 4,
  email: 'alex@berkeley.edu',
  privacySettings: { isProfilePublic: true, showContactToAcceptedOnly: true },
};

const mockDesignerCandidate: StudentProfile = {
  id: 'user-2',
  name: 'Maya Patel',
  avatarUrl: '',
  college: 'Stanford University',
  major: 'Product Design & CS',
  year: 'Junior',
  graduationYear: 2027,
  bio: 'Design systems engineer focusing on accessible UI.',
  primaryRole: 'UI/UX Design',
  skills: [
    { name: 'Figma', category: 'Design', level: 'Expert' },
    { name: 'UI/UX Design', category: 'Design', level: 'Expert' },
    { name: 'Design Systems', category: 'Design', level: 'Advanced' },
    { name: 'Tailwind CSS', category: 'Technical', level: 'Intermediate' },
  ],
  interests: ['EdTech', 'AI / Machine Learning', 'Design Systems'],
  availability: '15-20 hrs/week',
  preferredMode: 'Hybrid',
  collaborationGoals: ['Build a polished demo'],
  projects: [],
  hackathonsCount: 3,
  email: 'maya@stanford.edu',
  privacySettings: { isProfilePublic: true, showContactToAcceptedOnly: true },
};

const mockSameSkillCandidate: StudentProfile = {
  id: 'user-3',
  name: 'Dev Same',
  avatarUrl: '',
  college: 'MIT',
  major: 'CS',
  year: 'Freshman',
  graduationYear: 2029,
  bio: 'Just getting started with React.',
  primaryRole: 'Frontend',
  skills: [
    { name: 'React', category: 'Technical', level: 'Beginner' },
  ],
  interests: ['Crypto'],
  availability: '5-10 hrs/week',
  preferredMode: 'In-Person',
  collaborationGoals: ['Learn'],
  projects: [],
  hackathonsCount: 0,
  email: 'dev@mit.edu',
  privacySettings: { isProfilePublic: true, showContactToAcceptedOnly: true },
};

test('match score rewards complementary role and shared interests', () => {
  const match = calculateMatchScore(mockDesignerCandidate, mockUser);
  assert.ok(match.totalScore >= 80, `Expected >= 80 compatibility, got ${match.totalScore}`);
  assert.ok(match.sharedInterests.includes('EdTech'));
  assert.ok(match.sharedInterests.includes('AI / Machine Learning'));
  assert.ok(match.whyRecommended.length > 10);
});

test('match score yields lower score for low availability mismatch and zero shared interests', () => {
  const matchDesigner = calculateMatchScore(mockDesignerCandidate, mockUser);
  const matchSame = calculateMatchScore(mockSameSkillCandidate, mockUser);
  assert.ok(matchDesigner.totalScore > matchSame.totalScore, 'Designer with shared interests should outscore mismatched candidate');
});

test('team-aware matching rewards candidate that covers open skill gaps', () => {
  const mockTeam: Team = {
    id: 'team-1',
    name: 'HackTeam Alpha',
    tagline: 'AI for classrooms',
    description: 'Building an interactive classroom tutor',
    opportunityName: 'AI Hackathon 2026',
    leaderId: 'user-1',
    targetSize: 3,
    requiredSkills: ['React', 'UI/UX Design', 'Python'],
    members: [
      { studentId: 'user-1', role: 'Full-Stack Lead', joinedAt: '2026-01-01', isLeader: true },
    ],
    invitations: [],
    createdAt: '2026-01-01',
    tags: ['AI', 'EdTech'],
  };

  const match = calculateMatchScore(mockDesignerCandidate, mockUser, mockTeam, [mockUser]);
  assert.ok(match.missingSkillsCovered.includes('UI/UX Design'));
  assert.ok(match.complementarySkillsScore >= 55, `Expected >= 55 for 50% gap coverage, got ${match.complementarySkillsScore}`);
  assert.ok(match.whyRecommended.includes('UI/UX Design'));
});

test('filterCandidates excludes current user and sorts by score descending', () => {
  const candidates = [mockUser, mockDesignerCandidate, mockSameSkillCandidate];
  const results = filterCandidates(candidates, mockUser, null, {
    searchQuery: '',
    role: 'All',
    missingTeamSkillsOnly: false,
    minCompatibility: 0,
    availability: 'All',
    college: 'All',
    year: 'All',
    skillName: 'All',
  });

  assert.equal(results.length, 2, 'Should exclude current user');
  assert.equal(results[0].candidate.id, mockDesignerCandidate.id, 'Top candidate should be Maya');
  assert.ok(results[0].match.totalScore >= results[1].match.totalScore);
});
