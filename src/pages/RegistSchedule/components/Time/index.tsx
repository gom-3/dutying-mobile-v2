import { View, Text, StyleSheet, Switch } from 'react-native';
import OutsidePressHandler from 'react-native-outside-press';
import ClockIcon from '@/assets/svgs/clock.svg';
import DatePicker from '@/components/DatePicker';
import { COLOR } from '@/styles';
import useTimeHook from './index.hook';

const Time = () => {
  const {
    states: { isAllday, startDate, endDate },
    actions: { changeSwitchHandler, setIsOpen, onChangeStartTime, onChangeEndTime },
  } = useTimeHook();

  return (
    <View
      style={{
        borderBottomColor: COLOR.sub4,
        borderBottomWidth: 0.3,
        paddingTop: 14,
        paddingBottom: 40,
      }}
    >
      <OutsidePressHandler disabled={false} onOutsidePress={() => setIsOpen(false)}>
        <View style={styles.item}>
          <View style={styles.itemTitleWrapper}>
            <ClockIcon />
            <Text style={styles.itemTitle}>시간 설정</Text>
          </View>
          <View style={styles.itemTitleWrapper}>
            <Text style={[styles.allDayText, { color: isAllday ? COLOR.main2 : COLOR.sub25 }]}>
              하루종일
            </Text>
            <Switch
              trackColor={{ true: COLOR.main1 }}
              thumbColor="white"
              value={isAllday}
              onValueChange={changeSwitchHandler}
            />
          </View>
        </View>
        <View style={styles.usingView}>
          <View style={styles.itemTitleWrapper}>
            <DatePicker mode="date" date={startDate} text="시작일" onChange={onChangeStartTime} />
            <DatePicker
              style={{ marginLeft: 16 }}
              mode="date"
              date={endDate}
              text="종료일"
              onChange={onChangeEndTime}
            />
          </View>
          {!isAllday && (
            <View style={[styles.itemTitleWrapper, { marginTop: 18 }]}>
              <DatePicker
                mode="datetime"
                date={startDate}
                text="시작 시간"
                onChange={onChangeStartTime}
              />
              <DatePicker
                mode="datetime"
                date={endDate}
                text="종료 시간"
                onChange={onChangeEndTime}
                style={{ marginLeft: 30 }}
              />
            </View>
          )}
        </View>
      </OutsidePressHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  itemTitleWrapper: { flexDirection: 'row', alignItems: 'center' },
  itemTitle: { marginLeft: 8, fontFamily: 'Apple500', fontSize: 16, color: COLOR.sub2 },
  usingView: { marginHorizontal: 24, marginTop: 16 },
  allDayText: {
    fontFamily: 'Apple500',
    fontSize: 14,
    marginRight: 16,
  },
});

export default Time;
