import { create } from 'zustand';

export interface ExchangeRate {
  id: string;
  label: string;
  value: string;
  currency: string;
}

export interface ExchangeData {
  rates: ExchangeRate[];
  lastUpdate: string;
}

interface ExchangeState {
  data: ExchangeData | null;
  setExchangeData: (data: ExchangeData) => void;
}

export const useExchangeStore = create<ExchangeState>((set) => ({
  data: null,
  setExchangeData: (data) => set({ data }),
}));
