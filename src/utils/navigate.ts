import { createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type StackParams = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  MyPage: undefined;
  Group: undefined;
  RegistDuty: undefined;
  RegistSchedule: { isEdit?: boolean };
  ShiftType: undefined;
  ShiftTypeEdit: undefined;
  Share: undefined;
  Notification: undefined;
  Onboarding: undefined;
  DeviceCalendar: { isRedirected?: boolean };
  Term: undefined;
  Moim: undefined;
  MoimDetail: undefined;
  MoimEnter: undefined;
  Ward: undefined;
  WardOnboarding: undefined;
  WardCalendarPage: undefined;
  Friends: undefined;
  RequestFriend: undefined;
  EnterWard: undefined;
  RequestWardShift: undefined;
  RequestWardShiftConfirm: undefined;
};

export const Stack = createNativeStackNavigator<StackParams>();

export const navigationRef = createNavigationContainerRef<StackParams>();

export const navigate = <T extends keyof StackParams>(name: T, params?: StackParams[T]) => {
  if (navigationRef.isReady()) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    navigationRef.navigate(name, params);
  }
};

export const navigateToLoginAndResetHistory = () => {
  navigationRef.current?.reset({ index: 0, routes: [{ name: 'Login' }] });
};
