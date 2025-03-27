import { useLinkTo } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useMemo } from 'react';
import { Alert, Platform } from 'react-native';
import { type SvgProps } from 'react-native-svg';
import Toast from 'react-native-toast-message';
import EditShiftTypeIcon from '@/assets/svgs/edit-shift-type.svg';
import PlusIcon from '@/assets/svgs/plus-box.svg';
import ShareIcon from '@/assets/svgs/share.svg';
import SliderIcon from '@/assets/svgs/slider.svg';
import { useAccountStore } from '@/stores/account';
import { useCaledarDateStore } from '@/stores/calendar';
import { firebaseLogEvent } from '@/utils/event';

interface SideMenuItem {
  icon: React.FC<SvgProps>;
  title: string;
  onPress: () => void;
}

const useSideMenu = () => {
  const { account } = useAccountStore();
  const [setState] = useCaledarDateStore((state) => [state.setState]);

  const linkTo = useLinkTo();
  const navigateToMyPage = () => linkTo('MyPage');

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, []);

  const closeSideMenu = () => {
    setState('isSideMenuOpen', false);
  };

  const copyCode = async () => {
    await Clipboard.setStringAsync(account.code);
    Toast.show({
      type: 'success',
      text1: '코드가 복사되었어요!',
      text2: '코드를 통해 친구를 맺을 수 있어요👋',
      visibilityTime: 2000,
    });
  };

  const menuItemList: SideMenuItem[] = useMemo(
    () => [
      {
        icon: PlusIcon,
        title: '근무 등록',
        onPress: () => {
          if (account.wardId > 0 && account.shiftTeamId > 0) {
            Alert.alert('병동과 연동된 계정은 따로 근무 등록을 할 수 없습니다.');
            return;
          }
          firebaseLogEvent('move_regist_duty');
          linkTo('RegistDuty');
        },
      },
      {
        icon: EditShiftTypeIcon,
        title: '근무 유형 수정',
        onPress: () => {
          firebaseLogEvent('move_edit_shfit_type');
          linkTo('ShiftType');
        },
      },
      {
        icon: ShareIcon,
        title: '공유하기',
        onPress: () => {
          firebaseLogEvent('move_share');
          linkTo('Share');
        },
      },
      {
        icon: SliderIcon,
        title: '캘린더 관리',
        onPress: () => {
          firebaseLogEvent('move_calendar_link');
          linkTo('DeviceCalendar');
        },
      },
      {
        icon: EditShiftTypeIcon,
        title: '이벤트',
        onPress: () => {
          firebaseLogEvent('link_event');
          // firebaseLogEvent('link_evaluate_duty_page');
          Linking.openURL('https://www.instagram.com/dutying_official');
        },
      },
    ],
    [],
  );
  return {
    state: { account, menuItemList },
    actions: { closeSideMenu, navigateToMyPage, copyCode },
  };
};

export default useSideMenu;
