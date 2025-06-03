import Messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import * as NavigationBar from 'expo-navigation-bar';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect } from 'react';
import { Alert, type AppStateStatus, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EventProvider } from 'react-native-outside-press';
import Toast, { type BaseToastProps, SuccessToast } from 'react-native-toast-message';
import { useAppState } from '@/hooks/useAppState';
import Router from '@/pages/Router';
import { useAccountStore } from '@/stores/account';
import { COLOR } from '@/styles';
import axiosInstance from './src/api/client';
import { useFonts } from 'expo-font';

Sentry.init({
  dsn: 'https://93ddd999daaaa867ad39989278a40c0b@o4505477969084416.ingest.sentry.io/4506099006898176',
  tracesSampleRate: 1.0,
});

/** 업데이트 버전 확인 */
const getAppVersion = () => {
  console.log(Application.nativeApplicationVersion);
};

const toastConfig = {
  success: (props: BaseToastProps) => (
    <SuccessToast {...props} style={{ borderLeftColor: COLOR.main2 }} />
  ),
};

const registerForPushNotificationAsync = async () => {
  if (Device.isDevice) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowAlert: true,
      }),
    });
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#ff231f7c',
      });
    }

    // 가지고 있는 권한 가져오기
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // 권한 없으면 요청해서 가져오기
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('알림 권한을 가져오는데 실패했습니다.');
      return; // 권한이 없으면 Firebase 메시징 설정하지 않음
    }

    // 권한이 부여된 후에만 Firebase 메시징 설정
    try {
      // iOS와 Android 모두에서 필요시 등록
      if (!Messaging().isDeviceRegisteredForRemoteMessages) {
        await Messaging().registerDeviceForRemoteMessages();
      }

      const token = await Messaging().getToken();
      useAccountStore.getState().setState('deviceToken', token);
      console.log('Firebase 메시징 토큰 성공적으로 가져옴:', token);
    } catch (error) {
      console.error('Firebase 메시징 토큰 가져오기 실패:', error);
      // iOS에서 권한 문제로 실패할 수 있으므로 재시도
      if (Platform.OS === 'ios') {
        setTimeout(async () => {
          try {
            if (!Messaging().isDeviceRegisteredForRemoteMessages) {
              await Messaging().registerDeviceForRemoteMessages();
            }
            const retryToken = await Messaging().getToken();
            useAccountStore.getState().setState('deviceToken', retryToken);
          } catch (retryError) {
            console.error('Firebase 메시징 토큰 재시도 실패:', retryError);
          }
        }, 1000);
      }
    }
  }
};

SplashScreen.preventAutoHideAsync();

const onAppStateChange = (status: AppStateStatus) => {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
};

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

export default function App() {
  const { account } = useAccountStore();

  useEffect(() => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${
      useAccountStore.getState().accessToken
    }`;
  }, [account.accountId]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('white');
      NavigationBar.setButtonStyleAsync('dark');
    }
    registerForPushNotificationAsync();
    getAppVersion();
  }, []);

  useAppState(onAppStateChange);

  const [fontsLoaded, Error] = useFonts({
    Apple: require('./src/assets/fonts/AppleSDGothicNeoR.ttf'),
    Apple500: require('./src/assets/fonts/AppleSDGothicNeoM.ttf'),
    Apple600: require('./src/assets/fonts/AppleSDGothicNeoB.ttf'),
    Poppins: require('./src/assets/fonts/Poppins-Regular.ttf'),
    Poppins500: require('./src/assets/fonts/Poppins-Medium.ttf'),
    Poppins600: require('./src/assets/fonts/Poppins-Bold.ttf'),
    Line300: require('./src/assets/fonts/LINESeedKR-Th.ttf'),
    Line: require('./src/assets/fonts/LINESeedKR-Rg.ttf'),
    Line500: require('./src/assets/fonts/LINESeedKR-Bd.ttf'),
  });

  const prepare = useCallback(async () => {
    if (fontsLoaded || Error) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <EventProvider style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <Router />
          <Toast config={toastConfig} />
        </GestureHandlerRootView>
      </EventProvider>
    </QueryClientProvider>
  );
}
