import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  CURRENT_USER_ID,
  seedCourses,
  seedMatches,
  seedMessages,
  seedProfessors,
  seedReviews,
  seedTAs,
  seedThreads,
  studentById,
} from '@/data/seed';
import {
  buildMatchRecord,
  sharedClassLabel,
  shouldMatchOnConnect,
  threadIdForPeer,
} from '@/services/matching';
import type { ChatMessage, ChatThread, MatchRecord, Review, UserProfile } from '@/types';

export const FAKE_DEFAULT_PROFILE: UserProfile = {
  id: CURRENT_USER_ID,
  fullName: 'Jamie Park',
  program: 'B.S. Computer Science',
  yearLabel: 'Junior',
  classIds: ['cls-ds301', 'cls-cs101', 'cls-dist410'],
  bio: 'Demo profile — connect with classmates and keep your academic registry organized.',
  interests: ['Algorithms', 'Distributed systems', 'Study groups'],
  imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop',
};

type SwipeBuckets = { left: string[]; right: string[] };

function uniqPush(arr: string[], id: string) {
  if (arr.includes(id)) return arr;
  return [...arr, id];
}

function withoutId(arr: string[], id: string) {
  return arr.filter((x) => x !== id);
}

function initialBuckets(): SwipeBuckets {
  return { left: [], right: [] };
}

export interface AppState {
  isLoggedIn: boolean;
  hasOnboarded: boolean;
  profile: UserProfile | null;

  studentSwipes: SwipeBuckets;
  classSwipes: SwipeBuckets;
  professorSwipes: SwipeBuckets;
  taSwipes: SwipeBuckets;

  savedClasses: string[];
  savedProfessors: string[];
  savedTAs: string[];

  matches: MatchRecord[];
  threads: Record<string, ChatThread>;
  messages: Record<string, ChatMessage[]>;

  userReviews: Review[];
  dismissedMatchPeerId: string | null;
  _hasHydrated: boolean;

  login: () => void;
  logout: () => void;
  setProfile: (p: UserProfile) => void;
  completeOnboarding: (p: Omit<UserProfile, 'id'>) => void;

  swipeStudent: (dir: 'left' | 'right', peerId: string) => { match: boolean; peerId?: string };
  swipeClass: (dir: 'left' | 'right', id: string) => void;
  swipeProfessor: (dir: 'left' | 'right', id: string) => void;
  swipeTA: (dir: 'left' | 'right', id: string) => void;

  saveClass: (id: string) => void;
  saveProfessor: (id: string) => void;
  saveTA: (id: string) => void;
  unsaveClass: (id: string) => void;
  unsaveProfessor: (id: string) => void;
  unsaveTA: (id: string) => void;

  sendMessage: (threadId: string, body: string) => void;
  addReview: (r: Omit<Review, 'id' | 'authorName' | 'createdAt'> & { authorName?: string }) => void;
  setDismissedMatch: (peerId: string | null) => void;
  resetDemo: () => void;
}

function buildInitialThreadsAndMessages() {
  const threads: Record<string, ChatThread> = {};
  seedThreads.forEach((t) => {
    threads[t.id] = { ...t };
  });
  const messages: Record<string, ChatMessage[]> = {};
  Object.keys(seedMessages).forEach((k) => {
    messages[k] = [...seedMessages[k]];
  });
  return { threads, messages };
}

function buildInitialMatches(): MatchRecord[] {
  return seedMatches.map((m) => ({
    id: `match-${m.peerId}`,
    peerId: m.peerId,
    createdAt: new Date().toISOString(),
    threadId: m.threadId,
    sharedClassHint: m.sharedClassHint,
    metViaCourseCode: undefined,
  }));
}

const { threads: initialThreads, messages: initialMessages } = buildInitialThreadsAndMessages();

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isLoggedIn: true,
      hasOnboarded: true,
      profile: FAKE_DEFAULT_PROFILE,

      studentSwipes: initialBuckets(),
      classSwipes: initialBuckets(),
      professorSwipes: initialBuckets(),
      taSwipes: initialBuckets(),

      savedClasses: [],
      savedProfessors: [],
      savedTAs: [],

      matches: buildInitialMatches(),
      threads: { ...initialThreads },
      messages: { ...initialMessages },

      userReviews: [],
      dismissedMatchPeerId: null,
      _hasHydrated: false,

      login: () => set({ isLoggedIn: true }),

      logout: () =>
        set({
          isLoggedIn: true,
          hasOnboarded: true,
          profile: FAKE_DEFAULT_PROFILE,
          studentSwipes: initialBuckets(),
          classSwipes: initialBuckets(),
          professorSwipes: initialBuckets(),
          taSwipes: initialBuckets(),
          savedClasses: [],
          savedProfessors: [],
          savedTAs: [],
          matches: buildInitialMatches(),
          threads: { ...initialThreads },
          messages: { ...initialMessages },
          userReviews: [],
        }),

      setProfile: (p) => set({ profile: p }),

      completeOnboarding: (p) =>
        set({
          hasOnboarded: true,
          profile: { ...p, id: CURRENT_USER_ID },
        }),

      swipeStudent: (dir, peerId) => {
        if (peerId === CURRENT_USER_ID) return { match: false };
        const state = get();
        const { left, right } = state.studentSwipes;
        if (left.includes(peerId) || right.includes(peerId)) return { match: false };

        if (dir === 'left') {
          set({ studentSwipes: { left: uniqPush(left, peerId), right: withoutId(right, peerId) } });
          return { match: false };
        }

        const nextRight = uniqPush(withoutId(right, peerId), peerId);
        set({ studentSwipes: { left: withoutId(left, peerId), right: nextRight } });

        const alreadyMatched = state.matches.some((m) => m.peerId === peerId);
        if (alreadyMatched) return { match: false };

        const reciprocal = shouldMatchOnConnect(peerId);
        if (!reciprocal) return { match: false };

        const profile = state.profile;
        const record = buildMatchRecord(peerId, profile);
        const peer = studentById(peerId);
        const tid = threadIdForPeer(peerId);
        const thread: ChatThread = {
          id: tid,
          peerId,
          peerName: peer?.fullName ?? 'Classmate',
          peerImageUrl: peer?.imageUrl ?? '',
          lastMessagePreview: 'Say hello and share a time that works to connect.',
          updatedAt: new Date().toISOString(),
          sharedClassLabel: sharedClassLabel(profile, peerId),
          metViaCourseCode: record.metViaCourseCode,
        };

        set((s) => ({
          matches: uniqPushObjects(s.matches, record, (m) => m.peerId),
          threads: { ...s.threads, [tid]: thread },
          messages: s.messages[tid] ? s.messages : { ...s.messages, [tid]: [] },
        }));

        return { match: true, peerId };
      },

      swipeClass: (dir, id) => {
        set((s) => {
          let { left, right } = s.classSwipes;
          left = withoutId(left, id);
          right = withoutId(right, id);
          if (dir === 'left') left = uniqPush(left, id);
          else right = uniqPush(right, id);
          return { classSwipes: { left, right } };
        });
        if (dir === 'right') get().saveClass(id);
      },

      swipeProfessor: (dir, id) => {
        set((s) => {
          let { left, right } = s.professorSwipes;
          left = withoutId(left, id);
          right = withoutId(right, id);
          if (dir === 'left') left = uniqPush(left, id);
          else right = uniqPush(right, id);
          return { professorSwipes: { left, right } };
        });
        if (dir === 'right') get().saveProfessor(id);
      },

      swipeTA: (dir, id) => {
        set((s) => {
          let { left, right } = s.taSwipes;
          left = withoutId(left, id);
          right = withoutId(right, id);
          if (dir === 'left') left = uniqPush(left, id);
          else right = uniqPush(right, id);
          return { taSwipes: { left, right } };
        });
        if (dir === 'right') get().saveTA(id);
      },

      saveClass: (id) =>
        set((s) => ({
          savedClasses: s.savedClasses.includes(id) ? s.savedClasses : [...s.savedClasses, id],
        })),

      saveProfessor: (id) =>
        set((s) => ({
          savedProfessors: s.savedProfessors.includes(id)
            ? s.savedProfessors
            : [...s.savedProfessors, id],
        })),

      saveTA: (id) =>
        set((s) => ({
          savedTAs: s.savedTAs.includes(id) ? s.savedTAs : [...s.savedTAs, id],
        })),

      unsaveClass: (id) => set((s) => ({ savedClasses: s.savedClasses.filter((x) => x !== id) })),
      unsaveProfessor: (id) =>
        set((s) => ({ savedProfessors: s.savedProfessors.filter((x) => x !== id) })),
      unsaveTA: (id) => set((s) => ({ savedTAs: s.savedTAs.filter((x) => x !== id) })),

      sendMessage: (threadId, body) => {
        const msg: ChatMessage = {
          id: `msg-${Date.now()}`,
          threadId,
          senderId: 'me',
          body,
          createdAt: new Date().toISOString(),
        };
        set((s) => {
          const list = [...(s.messages[threadId] ?? []), msg];
          const t = s.threads[threadId];
          const threads = t
            ? {
                ...s.threads,
                [threadId]: {
                  ...t,
                  lastMessagePreview: body,
                  updatedAt: msg.createdAt,
                },
              }
            : s.threads;
          return { messages: { ...s.messages, [threadId]: list }, threads };
        });
      },

      addReview: (r) => {
        const id = `rev-${Date.now()}`;
        const profileName = get().profile?.fullName ?? 'You';
        const isAnonymous = r.isAnonymous ?? true;
        const name = r.authorName ?? (isAnonymous ? 'Anonymous' : profileName);
        const review: Review = {
          ...r,
          id,
          authorName: name,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        set((s) => ({ userReviews: [...s.userReviews, review] }));
      },

      setDismissedMatch: (peerId) => set({ dismissedMatchPeerId: peerId }),

      resetDemo: () =>
        set({
          matches: buildInitialMatches(),
          threads: { ...initialThreads },
          messages: { ...initialMessages },
          studentSwipes: initialBuckets(),
          dismissedMatchPeerId: null,
        }),
    }),
    {
      name: 'swipe-app-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        isLoggedIn: s.isLoggedIn,
        hasOnboarded: s.hasOnboarded,
        profile: s.profile,
        savedClasses: s.savedClasses,
        savedProfessors: s.savedProfessors,
        savedTAs: s.savedTAs,
        threads: s.threads,
        messages: s.messages,
        userReviews: s.userReviews,
      }),
      onRehydrateStorage: () => (state) => {
        useAppStore.setState({ _hasHydrated: true });
        if (!state) return;
        useAppStore.setState({
          isLoggedIn: true,
          hasOnboarded: true,
          profile: state.profile ?? FAKE_DEFAULT_PROFILE,
        });
      },
    }
  )
);

function uniqPushObjects<T>(arr: T[], item: T, key: (x: T) => string) {
  const k = key(item);
  if (arr.some((x) => key(x) === k)) return arr;
  return [...arr, item];
}

export function mergedReviews(kind: import('@/types').Review['entityKind'], entityId: string) {
  const seed = seedReviews.filter((r) => r.entityKind === kind && r.entityId === entityId);
  const user = useAppStore
    .getState()
    .userReviews.filter((r) => r.entityKind === kind && r.entityId === entityId);
  return [...seed, ...user];
}

export function allCourseIds() {
  return seedCourses.map((c) => c.id);
}

export function allProfessorIds() {
  return seedProfessors.map((p) => p.id);
}

export function allTAIds() {
  return seedTAs.map((t) => t.id);
}
