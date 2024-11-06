import AsyncStorage from '@react-native-async-storage/async-storage';
import { type Calendar } from 'expo-calendar';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  calendars: Calendar[];
  calendarLink: {
    [key: string]: boolean;
  };
  dutyingCalendars: Calendar[];
  isChanged: boolean;
}

interface Store extends State {
  setState: (key: keyof State, value: State[keyof State]) => void;
  setLink: (key: string, value: boolean) => void;
}

export const useDeviceCalendarStore = createWithEqualityFn<Store>()(
  devtools(
    persist(
      (set) => ({
        calendars: [],
        calendarLink: {},
        dutyingCalendars: [],
        isChanged: true,
        setLink: (key, value) =>
          set((state) => ({ calendarLink: { ...state.calendarLink, [key]: value } })),
        setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
      }),
      { name: 'useDevcieCalendarStore', storage: createJSONStorage(() => AsyncStorage) },
    ),
  ),
  shallow,
);
