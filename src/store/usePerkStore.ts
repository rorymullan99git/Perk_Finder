import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CARDS_MAP } from '@/data/cards';
import { MERCHANTS_MAP } from '@/data/merchants';

export const APP_TABS = ['best', 'cards', 'savings', 'giftcards', 'method'] as const;
export type AppTab = (typeof APP_TABS)[number];

export function isAppTab(value: string): value is AppTab {
  return (APP_TABS as readonly string[]).includes(value);
}

interface PerkStoreState {
  // Persisted state
  heldCardIds: string[];
  favoriteMerchants: string[];

  // Ephemeral state (the active tab lives in the URL hash)
  activeTab: AppTab;
  selectedMerchantId: string;
  spendAud: number;

  // Actions
  toggleHeldCard: (cardId: string) => void;
  clearAllHeldCards: () => void;
  setActiveTab: (tab: AppTab) => void;
  setSelectedMerchantId: (id: string) => void;
  setSpendAud: (amount: number) => void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const usePerkStore = create<PerkStoreState>()(
  persist(
    (set, get) => ({
      heldCardIds: [],
      favoriteMerchants: ['woolworths', 'coles', 'bunnings', 'jb_hifi', 'ampol', 'seven_eleven'],

      activeTab: 'best',
      selectedMerchantId: 'woolworths',
      spendAud: 100,

      toggleHeldCard: (cardId: string) => {
        const { heldCardIds } = get();
        set({
          heldCardIds: heldCardIds.includes(cardId)
            ? heldCardIds.filter((id) => id !== cardId)
            : [...heldCardIds, cardId],
        });
      },

      clearAllHeldCards: () => set({ heldCardIds: [] }),

      setActiveTab: (tab: AppTab) => {
        set({ activeTab: tab });
        if (typeof window === 'undefined') return;
        const current = window.location.hash.slice(1) || 'best';
        if (current === tab) return;
        if (tab === 'best') {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        } else {
          window.location.hash = tab;
        }
      },

      setSelectedMerchantId: (id: string) => set({ selectedMerchantId: id }),

      setSpendAud: (amount: number) => set({ spendAud: Math.max(1, amount) }),
    }),
    {
      name: 'perkpilot_storage_v1',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : noopStorage)),
      skipHydration: true,
      partialize: (state) => ({
        heldCardIds: state.heldCardIds,
        favoriteMerchants: state.favoriteMerchants,
      }),
      // Only restore known fields and drop ids that no longer exist in the dataset.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<PerkStoreState>;
        return {
          ...current,
          heldCardIds: Array.isArray(p.heldCardIds)
            ? p.heldCardIds.filter((id) => typeof id === 'string' && id in CARDS_MAP)
            : current.heldCardIds,
          favoriteMerchants: Array.isArray(p.favoriteMerchants)
            ? p.favoriteMerchants.filter((id) => typeof id === 'string' && id in MERCHANTS_MAP)
            : current.favoriteMerchants,
        };
      },
    }
  )
);
