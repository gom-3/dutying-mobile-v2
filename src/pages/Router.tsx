import { type LinkingOptions, NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import useShiftType from '@/hooks/useShiftType';
import { Stack, type StackParams, navigationRef } from '@/utils/navigate';
import DeviceCalendarPage from './DeviceCalendarPage';
import EnterWardPage from './EnterWardPage';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import Term from './LoginPage/Term';
import MyPage from './MyPage';
import Notification from './NotificationPage';
import OnboardingPage from './OnboardingPage';
import RegistDuty from './RegistDuty';
import RegistSchedulePage from './RegistSchedule';
import SharePage from './SharePage';
import ShiftTypePage from './ShiftTypePage';
import ShiftTypeEditPage from './ShiftTypePage/ShiftTypeEditPage';
import SignupPage from './SignupPage';
import FriendsPage from './Social/Friend';
import RequestFriendPage from './Social/Friend/Request';
import MoimPage from './Social/Moim';
import MoimDetailPage from './Social/Moim/MoimDetailPage';
import MoimEnterPage from './Social/Moim/MoimEnterPage';
import WardPage from './Ward';
import WardOnboardingPage from './Ward/Onboarding';
import RequestWardShiftPage from './Ward/Request';
import RequestShift from './Ward/Request/RequestShift';

const prefix = Linking.createURL('/');

const Router = () => {
  const linking: LinkingOptions<StackParams> = {
    prefixes: [prefix],
    config: {
      screens: {
        Login: 'login',
        Moim: 'moim',
      },
    },
  };
  useShiftType();

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Term" component={Term} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen
          name="Friends"
          component={FriendsPage}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen name="RequestFriend" component={RequestFriendPage} />
        <Stack.Screen
          name="Moim"
          component={MoimPage}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen name="MoimEnter" component={MoimEnterPage} />
        <Stack.Screen name="MoimDetail" component={MoimDetailPage} />
        <Stack.Screen name="RegistDuty" component={RegistDuty} />
        <Stack.Screen name="RegistSchedule" component={RegistSchedulePage} />
        <Stack.Screen name="ShiftType" component={ShiftTypePage} />
        <Stack.Screen name="ShiftTypeEdit" component={ShiftTypeEditPage} />
        <Stack.Screen name="Share" component={SharePage} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="EnterWard" component={EnterWardPage} />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingPage}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="DeviceCalendar" component={DeviceCalendarPage} />
        <Stack.Screen
          name="Ward"
          component={WardPage}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen
          name="WardOnboarding"
          component={WardOnboardingPage}
          options={{ animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name="RequestWardShift"
          component={RequestWardShiftPage}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen name="RequestWardShiftConfirm" component={RequestShift} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
