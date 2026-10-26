import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AppTab = 'ranker' | 'wallet' | 'savings' | 'giftcards' | 'manifesto';

interface PerkStoreState {
  // Persisted state
  heldCardIds: string[];
  favoriteMerchants: string[];
  activeTab: AppTab;
  
  // Ephemeral state
  selectedMerchantId: string;
  spendAud: number;
  showMathModal: boolean;
  selectedAccountForCalculator?: string;

  // Actions
  toggleHeldCard: (cardId: string) => void;
  setHeldCardIds: (cardIds: string[]) => void;
  selectAllCards: (cardIds: string[]) => void;
  clearAllHeldCards: () => void;
  toggleFavoriteMerchant: (merchantId: string) => void;
  setActiveTab: (tab: AppTab) => void;
  setSelectedMerchantId: (id: string) => void;
  setSpendAud: (amount: number) => void;
  setShowMathModal: (show: boolean) => void;
  setSelectedAccountForCalculator: (id?: string) => void;
}

export const usePerkStore = create<PerkStoreState>()(
  persist(
    (set, get) => ({
      // Defaults: sensible starting deck for typical Aussies
      heldCardIds: [
        'macquarie_transaction_debit',
        'cba_smart_debit',
        'ing_orange_everyday',
      ],
      favoriteMerchants: ['woolworths', 'coles', 'seven_eleven', 'jb_hifi', 'ampol', 'bunnings'],
      activeTab: 'ranker',

      // Ephemeral
      selectedMerchantId: 'woolworths',
      spendAud: 180,
      showMathModal: false,
      selectedAccountForCalculator: undefined,

      toggleHeldCard: (cardId: string) => {
        const { heldCardIds } = get();
        if (heldCardIds.includes(cardId)) {
          set({ heldCardIds: heldCardIds.filter(id => id !== cardId) });
        } else {
          set({ heldCardIds: [...heldCardIds, cardId] });
        }
      },

      setHeldCardIds: (cardIds: string[]) => set({ heldCardIds: cardIds }),

      selectAllCards: (cardIds: string[]) => set({ heldCardIds: cardIds }),

      clearAllHeldCards: () => set({ heldCardIds: [] }),

      toggleFavoriteMerchant: (merchantId: string) => {
        const { favoriteMerchants } = get();
        if (favoriteMerchants.includes(merchantId)) {
          set({ favoriteMerchants: favoriteMerchants.filter(id => id !== merchantId) });
        } else {
          set({ favoriteMerchants: [...favoriteMerchants, merchantId] });
        }
      },

      setActiveTab: (tab: AppTab) => set({ activeTab: tab }),

      setSelectedMerchantId: (id: string) => set({ selectedMerchantId: id }),

      setSpendAud: (amount: number) => set({ spendAud: Math.max(1, amount) }),

      setShowMathModal: (show: boolean) => set({ showMathModal: show }),

      setSelectedAccountForCalculator: (id?: string) => set({ selectedAccountForCalculator: id }),
    }),
    {
      name: 'perkpilot_storage_v1',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      skipHydration: true,
      partialize: (state) => ({
        heldCardIds: state.heldCardIds,
        favoriteMerchants: state.favoriteMerchants,
        activeTab: state.activeTab,
      }),
    }
  )
);
