export type ExploreSegment = 'students' | 'classes' | 'professors' | 'tas';

export type DifficultyTag = 'Foundational' | 'Intermediate' | 'Advanced' | 'Lab-heavy';

export type ReviewEntityKind = 'class' | 'professor' | 'ta';

export interface StudentProfile {
  id: string;
  fullName: string;
  university: string;
  program: string;
  yearLabel: string;
  classIds: string[];
  bio: string;
  interests: string[];
  imageUrl: string;
  suggestedContexts: string[];
}

export interface CourseOffering {
  id: string;
  code: string;
  title: string;
  department: string;
  difficulty: DifficultyTag;
  units: number;
  rating: number;
  reviewCount: number;
  reviewSnippet: string;
  instructorName: string;
  semester: string;
  tags: string[];
  traits: string[];
}

export interface ProfessorProfile {
  id: string;
  name: string;
  department: string;
  rating: number;
  reviewCount: number;
  activeTerm: string;
  reviewSnippet: string;
  coursesTaught: string[];
  imageUrl: string;
  traits: string[];
}

export interface TAProfile {
  id: string;
  name: string;
  department: string;
  associatedCourseCode: string;
  officeHours: string;
  rating: number;
  reviewSnippet: string;
  imageUrl: string;
  traits: string[];
}

export interface Review {
  id: string;
  authorName: string;
  grade?: string;
  rating: number;
  body: string;
  tags: string[];
  createdAt: string;
  entityKind: ReviewEntityKind;
  entityId: string;
  isAnonymous?: boolean;
}

export interface MatchRecord {
  id: string;
  peerId: string;
  createdAt: string;
  threadId: string;
  sharedClassHint?: string;
  metViaCourseCode?: string;
}

export interface ChatThread {
  id: string;
  peerId: string;
  peerName: string;
  peerImageUrl: string;
  lastMessagePreview: string;
  updatedAt: string;
  sharedClassLabel?: string;
  metViaCourseCode?: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: 'me' | string;
  body: string;
  createdAt: string;
}

export interface CollaborationEndorsement {
  id: string;
  fromName: string;
  context: string;
  trait: string;
}

export interface UserProfile {
  id: 'me';
  fullName: string;
  program: string;
  yearLabel: string;
  classIds: string[];
  bio: string;
  interests: string[];
  imageUrl: string;
}
