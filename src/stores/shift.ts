import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { type Shift } from '@/types/shift';
import { type TValues } from '@/types/util';

interface State {
  shiftTypes: Map<number, Shift>;
}

interface Store extends State {
  setState: (key: keyof State, value: TValues<State>) => void;
}

export const useShiftTypeStore = createWithEqualityFn<Store>()(
  devtools(
    persist(
      (set) => ({
        shiftTypes: new Map<number, Shift>(),
        setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
      }),
      { name: 'useShiftTypeStore', storage: createJSONStorage(() => AsyncStorage) },
    ),
  ),
  shallow,
);
