import { create } from 'zustand';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface Profile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountNumbers: string[];
}

interface Account {
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  account: string;
}

interface AppStore {
  // Auth
  user: User | null;
  profile: Profile | null;
  isLoggedIn: boolean;
  // Accounts
  accounts: Account[];
  transactions: Transaction[];
  // Actions
  setUser: (u: User | null) => void;
  setProfile: (p: Profile | null) => void;
  setLoggedIn: (v: boolean) => void;
  setAccounts: (a: Account[]) => void;
  setTransactions: (t: Transaction[]) => void;
  addTransaction: (t: Transaction) => void;
  logout: () => void;
}

export const useStore = create<AppStore>((set) => ({
  user:         null,
  profile:      null,
  isLoggedIn:   false,
  accounts:     [],
  transactions: [],

  setUser:         (user)         => set({ user }),
  setProfile:      (profile)      => set({ profile }),
  setLoggedIn:     (isLoggedIn)   => set({ isLoggedIn }),
  setAccounts:     (accounts)     => set({ accounts }),
  setTransactions: (transactions) => set({ transactions }),
  addTransaction:  (t)            => set((s) => ({ transactions: [t, ...s.transactions] })),
  logout: () => set({ user: null, profile: null, isLoggedIn: false, accounts: [], transactions: [] }),
}));
