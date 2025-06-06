import { View, Text, Pressable, StyleSheet } from 'react-native';
import { navigate } from '@/utils/navigate';
import { COLOR } from '@/styles';

interface Props {
  tab: 'calendar' | 'request';
}

const WardHeader = ({ tab }: Props) => {
  const navigateToCalendar = () => navigate('Ward');
  const navigateToRequestShift = () => navigate('RequestWardShift');

  return (
    <View
      style={{
        flexDirection: 'row',
        marginLeft: 24,
        marginTop: 15,
        alignItems: 'center',
      }}
    >
      <Pressable onPress={navigateToCalendar}>
        <Text style={tab === 'calendar' ? styles.highlight : styles.normal}>근무표</Text>
      </Pressable>
      <Pressable onPress={navigateToRequestShift}>
        <Text style={[tab === 'request' ? styles.highlight : styles.normal, { marginLeft: 20 }]}>
          신청근무
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  highlight: {
    fontSize: 20,
    fontFamily: 'Apple600',
    color: COLOR.main1,
    textDecorationLine: 'underline',
  },
  normal: {
    fontFamily: 'Apple500',
    fontSize: 20,
    color: COLOR.sub3,
  },
});

export default WardHeader;
