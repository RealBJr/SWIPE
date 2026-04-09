import {
  courseById,
  peersWhoAlreadyConnected,
  professorById,
  seedProfessors,
  seedStudents,
  seedTAs,
  studentById,
  taById,
} from '@/data/seed';
import type { MatchRecord, UserProfile } from '@/types';

export function threadIdForPeer(peerId: string) {
  return `thread-${peerId}`;
}

export function sharedClassLabel(profile: UserProfile | null, peerId: string) {
  if (!profile) return undefined;
  const peer = studentById(peerId);
  if (!peer) return undefined;
  const shared = profile.classIds.filter((id) => peer.classIds.includes(id));
  if (shared.length === 0) return undefined;
  const first = courseById(shared[0]);
  return first ? `Shared: ${first.title}` : 'Shared class';
}

export function metViaCode(profile: UserProfile | null, peerId: string) {
  if (!profile) return undefined;
  const peer = studentById(peerId);
  if (!peer) return undefined;
  const shared = profile.classIds.filter((id) => peer.classIds.includes(id));
  if (shared.length === 0) return undefined;
  return courseById(shared[0])?.code;
}

export function shouldMatchOnConnect(peerId: string) {
  return peersWhoAlreadyConnected.includes(peerId);
}

export function buildMatchRecord(peerId: string, profile: UserProfile | null): MatchRecord {
  const peer = studentById(peerId);
  const tid = threadIdForPeer(peerId);
  const shared = metViaCode(profile, peerId);
  const hint = sharedClassLabel(profile, peerId)?.replace(/^Shared: /, '');
  return {
    id: `match-${peerId}`,
    peerId,
    createdAt: new Date().toISOString(),
    threadId: tid,
    sharedClassHint: hint,
    metViaCourseCode: shared,
  };
}

export function sortStudentIdsForExplore(me: UserProfile | null, candidates: string[]) {
  const myClasses = new Set(me?.classIds ?? []);
  const myProgram = me?.program ?? '';
  const myInterests = new Set(me?.interests.map((i) => i.toLowerCase()) ?? []);

  const scored = candidates.map((id) => {
    const s = seedStudents.find((x) => x.id === id);
    if (!s) return { id, score: 0 };
    let score = 0;
    const shared = s.classIds.filter((c) => myClasses.has(c)).length;
    score += shared * 100;
    if (s.program === myProgram) score += 20;
    const overlap = s.interests.filter((i) => myInterests.has(i.toLowerCase())).length;
    score += overlap * 5;
    return { id, score };
  });

  scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return scored.map((x) => x.id);
}

export function sortCoursesByRelevance(ids: string[], courseIds: string[]) {
  const set = new Set(courseIds);
  const scored = ids.map((id) => {
    const c = courseById(id);
    if (!c) return { id, score: 0 };
    let score = c.rating * 10 + Math.min(c.reviewCount, 200) / 20;
    if (set.has(id)) score += 15;
    return { id, score };
  });
  scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return scored.map((x) => x.id);
}

export function sortProfessors(ids: string[]) {
  const scored = ids.map((id) => {
    const p = professorById(id) ?? seedProfessors.find((x) => x.id === id);
    const rating = p?.rating ?? 0;
    const rc = p?.reviewCount ?? 0;
    return { id, score: rating * 10 + Math.min(rc, 200) / 20 };
  });
  scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return scored.map((x) => x.id);
}

export function sortTAs(ids: string[]) {
  const scored = ids.map((id) => {
    const ta = taById(id) ?? seedTAs.find((x) => x.id === id);
    return { id, score: (ta?.rating ?? 0) * 10 };
  });
  scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return scored.map((x) => x.id);
}
