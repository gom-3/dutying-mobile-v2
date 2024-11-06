import Constants from 'expo-constants';
import { type ReactNode, useEffect } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useAccountStore } from '@/stores/account';
import { navigateToLoginAndResetHistory } from '@/utils/navigate';
import { screenHeight, screenWidth } from '@/styles';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  withoutLogin?: boolean;
}

const PageViewContainer = ({ children, withoutLogin, style }: Props) => {
  const [account] = useAccountStore((state) => [state.account, state.setState]);

  useEffect(() => {
    // expo go 환경일 때는 소셜로그인이 불가능하니 임시 로그인 처리
    if (Constants.appOwnership !== 'expo') {
      if (account.accountId === 0 && !withoutLogin)
        setTimeout(() => navigateToLoginAndResetHistory(), 100);
    } else {
      // setState('account', demoLoginAccount);
    }
  }, [account.accountId]);

  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'white',
    zIndex: 5,
  },
});

export default PageViewContainer;
