import {
  seedCourses,
  seedProfessors,
  seedStudents,
  seedTAs,
} from '@/data/seed';
import {
  sortCoursesByRelevance,
  sortProfessors,
  sortStudentIdsForExplore,
  sortTAs,
} from '@/services/matching';
import { allCourseIds, allProfessorIds, allTAIds, mergedReviews, useAppStore } from '@/store/app-store';
import type { ExploreSegment, Review, ReviewEntityKind, UserProfile } from '@/types';

function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function fetchExploreQueue(segment: ExploreSegment) {
  const profile = useAppStore.getState().profile;
  return delay(120, buildQueue(segment, profile));
}

function buildQueue(segment: ExploreSegment, profile: UserProfile | null) {
  if (segment === 'students') {
    const sw = useAppStore.getState().studentSwipes;
    const seen = new Set([...sw.left, ...sw.right]);
    const matched = new Set(useAppStore.getState().matches.map((m) => m.peerId));
    const ids = seedStudents
      .map((s) => s.id)
      .filter((id) => !seen.has(id) && !matched.has(id));
    return sortStudentIdsForExplore(profile, ids);
  }
  if (segment === 'classes') {
    const sw = useAppStore.getState().classSwipes;
    const seen = new Set([...sw.left, ...sw.right]);
    const saved = new Set(useAppStore.getState().savedClasses);
    const ids = allCourseIds().filter((id) => !seen.has(id) && !saved.has(id));
    return sortCoursesByRelevance(ids, profile?.classIds ?? []);
  }
  if (segment === 'professors') {
    const sw = useAppStore.getState().professorSwipes;
    const seen = new Set([...sw.left, ...sw.right]);
    const saved = new Set(useAppStore.getState().savedProfessors);
    const ids = allProfessorIds().filter((id) => !seen.has(id) && !saved.has(id));
    return sortProfessors(ids);
  }
  const sw = useAppStore.getState().taSwipes;
  const seen = new Set([...sw.left, ...sw.right]);
  const saved = new Set(useAppStore.getState().savedTAs);
  const ids = allTAIds().filter((id) => !seen.has(id) && !saved.has(id));
  return sortTAs(ids);
}

export async function fetchEntityReviews(kind: ReviewEntityKind, entityId: string) {
  const list = mergedReviews(kind, entityId);
  return delay(80, list);
}

export async function submitReview(input: Omit<Review, 'id' | 'authorName' | 'createdAt'>) {
  await delay(100, null);
  useAppStore.getState().addReview(input);
}

export function getCourse(id: string) {
  return seedCourses.find((c) => c.id === id);
}

export function getProfessor(id: string) {
  return seedProfessors.find((p) => p.id === id);
}

export function getTA(id: string) {
  return seedTAs.find((t) => t.id === id);
}
