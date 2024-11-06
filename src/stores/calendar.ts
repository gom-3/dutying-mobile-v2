import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { type DateType } from '@/pages/HomePage/components/Calendar';

interface State {
  date: Date;
  calendar: DateType[];
  cardDefaultIndex: number;
  isCardOpen: boolean;
  isSideMenuOpen: boolean;
  isScheduleUpdated: boolean;
  setDateOnThread: (value: string) => void;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useCaledarDateStore = createWithEqualityFn<Store>()(
  devtools((set) => ({
    date: new Date(),
    calendar: [],
    cardDefaultIndex: 0,
    isSideMenuOpen: false,
    isCardOpen: false,
    isScheduleUpdated: false,
    setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
    setDateOnThread: (value) => set((prev) => ({ ...prev, date: new Date(value) })),
  })),
  shallow,
);
