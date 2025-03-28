import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { images } from '@/assets/images/profiles';

interface State {
  id: number;
  name: string;
  image: string;
  photo: string | null;
  step: number;
  isLoading: boolean;
}

interface Store extends State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: (key: keyof State, value: any) => void;
}

export const useSignupStore = createWithEqualityFn<Store>()(
  devtools((set) => ({
    id: 0,
    name: '',
    step: 1,
    photo: null,
    isPhoto: false,
    isLoading: false,
    image: images[Math.floor(Math.random() * 30)],
    setState: (state, value) => set((prev) => ({ ...prev, [state]: value })),
  })),
  shallow,
);
