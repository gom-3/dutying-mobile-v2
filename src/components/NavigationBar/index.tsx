import { useQueryClient } from '@tanstack/react-query';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import SelectedLogoIcon from '@/assets/svgs/logo-selected.svg';
import LogoIcon from '@/assets/svgs/logo.svg';
import SelectedSocialIcon from '@/assets/svgs/social-selected.svg';
import SocialIcon from '@/assets/svgs/social.svg';
import SelectedWardIcon from '@/assets/svgs/ward-selected.svg';
import WardIcon from '@/assets/svgs/ward.svg';
import { firebaseLogEvent } from '@/utils/event';
import { navigate } from '@/utils/navigate';
import { COLOR, screenWidth } from '@/styles';

interface Props {
  page: 'home' | 'social' | 'ward';
}

const NavigationBar = ({ page }: Props) => {
  const queryClient = useQueryClient();

  const pressHomeTab = () => {
    firebaseLogEvent('navigation_home');
    navigate('Home');
  };

  const pressSocialTab = () => {
    firebaseLogEvent('navigation_social');
    navigate('Moim');
  };

  const pressWardTab = () => {
    firebaseLogEvent('navigate_ward');
    queryClient.invalidateQueries({ queryKey: ['getMyAccount'] });
    queryClient.refetchQueries({ queryKey: ['getMyAccount'] });
    navigate('Ward');
  };

  return (
    <View style={styles.navigationContainer}>
      <View style={styles.navigationView}>
        <Pressable
          onPress={pressHomeTab}
          style={[styles.itemView, { backgroundColor: page === 'home' ? COLOR.main4 : COLOR.bg }]}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {page === 'home' ? <SelectedLogoIcon /> : <LogoIcon />}
            <Text
              style={[
                styles.itemText,
                {
                  color: page === 'home' ? COLOR.main1 : COLOR.sub3,
                  fontFamily: page === 'home' ? 'Apple600' : 'Apple500',
                },
              ]}
            >
              홈
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={pressSocialTab}
          style={[styles.itemView, { backgroundColor: page === 'social' ? COLOR.main4 : COLOR.bg }]}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {page === 'social' ? <SelectedSocialIcon /> : <SocialIcon />}
            <Text
              style={[
                styles.itemText,
                {
                  color: page === 'social' ? COLOR.main1 : COLOR.sub3,
                  fontFamily: page === 'social' ? 'Apple600' : 'Apple500',
                },
              ]}
            >
              소셜
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={pressWardTab}
          style={[styles.itemView, { backgroundColor: page === 'ward' ? COLOR.main4 : COLOR.bg }]}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {page === 'ward' ? <SelectedWardIcon /> : <WardIcon />}
            <Text
              style={[
                styles.itemText,
                {
                  color: page === 'ward' ? COLOR.main1 : COLOR.sub3,
                  fontFamily: page === 'ward' ? 'Apple600' : 'Apple500',
                },
              ]}
            >
              병동
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 10 : 0,
    borderTopColor: COLOR.sub45,
    borderTopWidth: 1,
    backgroundColor: COLOR.bg,
  },
  navigationView: {
    flexDirection: 'row',
    flex: 1,
    width: screenWidth,
    padding: 2,
    backgroundColor: COLOR.bg,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  itemView: { flex: 1, marginBottom: 40, alignItems: 'center', padding: 6, borderRadius: 10 },
  itemText: { fontSize: 12 },
});

export default NavigationBar;
