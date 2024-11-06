import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import BellIcon from '@/assets/svgs/bell.svg';
import BurgerIcon from '@/assets/svgs/burger.svg';
import MonthSelector from '@/components/MonthSelector';
import { COLOR } from '@/styles';
import useCalendarHeader from './index.hook';

interface Props {
  isImage?: boolean;
}

const Header = ({ isImage }: Props) => {
  const {
    states: { shiftTypes, shiftTypesCount },
    actions: { navigateToNotification, openSideMenu },
  } = useCalendarHeader();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.firstLevelView}>
        <MonthSelector isImage={isImage} />
        <View style={styles.sideMenuView}>
          {!isImage && (
            <TouchableOpacity onPress={navigateToNotification}>
              <View style={styles.bellView}>
                <BellIcon />
                {/* <View style={styles.alertDotView} /> */}
              </View>
            </TouchableOpacity>
          )}
          {!isImage && (
            <TouchableOpacity onPress={openSideMenu}>
              <BurgerIcon />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.secondLevelView}>
        {shiftTypes.size > 0 &&
          Array.from(shiftTypes.values()).map((shift) => (
            <View key={`${shift.accountShiftTypeId}`} style={styles.shiftView}>
              <View style={[styles.shiftBoxView, { backgroundColor: shift.color }]}>
                <Text style={styles.shiftText}>{shift.shortName}</Text>
              </View>
              <Text style={styles.shiftCountText}>
                {shiftTypesCount.get(shift.accountShiftTypeId) || 0}
              </Text>
            </View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 15,
    backgroundColor: 'white',
    marginBottom: 22,
    // zIndex: 3,
  },
  firstLevelView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sideMenuView: {
    flexDirection: 'row',
  },
  bellView: {
    position: 'relative',
    width: 24,
    marginRight: 14,
  },
  secondLevelView: {
    flexDirection: 'row',
    marginTop: 16,
  },
  shiftView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  shiftBoxView: {
    borderRadius: 2,
    width: 13,
    height: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shiftText: {
    fontFamily: 'Poppins',
    fontSize: 10,
    color: 'white',
  },
  shiftCountText: {
    fontSize: 12,
    color: COLOR.sub3,
    marginLeft: 4,
  },
});

export default Header;
