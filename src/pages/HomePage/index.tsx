import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as NavigationBarAndroid from 'expo-navigation-bar';
import { useEffect } from 'react';
import { View, Text, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registDutyImage } from '@/assets/images/onboarding';
import { FreeAlertModal } from '@/components/AlertModal';
import NavigationBar from '@/components/NavigationBar';
import PageViewContainer from '@/components/PageView';
import useDeviceCalendar from '@/hooks/useDeviceCalendar';
import { useAccountStore } from '@/stores/account';
import { useCaledarDateStore } from '@/stores/calendar';
import { useOnboardingStore } from '@/stores/onboarding';
import { navigate } from '@/utils/navigate';
import { COLOR, screenWidth } from '@/styles';
import Calendar from './components/Calendar';
import Header from './components/Header';
import ScheduleCard from './components/ScheduleCard';
import SideMenu from './components/SideMenu';

const HomePage = () => {
  const [account] = useAccountStore((state) => [state.account]);
  const [isCardOpen, isSideMenuOpen] = useCaledarDateStore((state) => [
    state.isCardOpen,
    state.isSideMenuOpen,
  ]);
  const { regist, setState } = useOnboardingStore();

  const closeRegistPopup = () => {
    setState('regist', true);
  };
  const acceptRegistPopup = () => {
    setState('regist', true);
    navigate('RegistDuty');
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBarAndroid.setVisibilityAsync('hidden');
    }
  }, []);

  useDeviceCalendar();
  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView style={{ flex: 1 }}>
          {account.accountId > 0 && !isCardOpen && (
            <FreeAlertModal
              exitButton
              isOpen={!regist && account.accountId > 0}
              close={closeRegistPopup}
              accept={acceptRegistPopup}
              acceptText="근무 등록 하러 가기"
              context={
                <View style={{ paddingBottom: 40, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
                    <Image
                      source={registDutyImage[0]}
                      resizeMode="contain"
                      style={{
                        width: screenWidth * 0.7,
                        height: (screenWidth * 0.7) / 4,
                        marginBottom: 32,
                      }}
                    />
                  </View>
                  <Text style={{ fontFamily: 'Apple500', fontSize: 20, color: COLOR.sub1 }}>
                    간편하게
                  </Text>
                  <Text style={{ fontFamily: 'Apple500', fontSize: 20, color: COLOR.sub1 }}>
                    근무표 등록해보세요!
                  </Text>
                </View>
              }
            />
          )}
          {/* {account.accountId > 0 && !isCardOpen && (
            <FreeAlertModal
              exitButton
              isOpen={!isSurveyEvent && account.accountId > 0 && isDoneRegist}
              close={closeEventPopup}
              accept={acceptEventPopup}
              acceptText="이벤트 하러 가기"
              context={
                <View style={{ alignItems: 'center' }}>
                  <View style={{ width: '100%' }}>
                    <Image
                      source={eventImages[0]}
                      resizeMode="contain"
                      style={{
                        width: screenWidth,
                        height: screenWidth * 0.7,
                        marginBottom: 32,
                      }}
                    />
                  </View>
                </View>
              }
            />
          )} */}
          <Header />
          <Calendar />
          <NavigationBar page="home" />
        </SafeAreaView>
        {isSideMenuOpen && <SideMenu />}
        <ScheduleCard isCardOpen={isCardOpen} />
      </BottomSheetModalProvider>
    </PageViewContainer>
  );
};

export default HomePage;
