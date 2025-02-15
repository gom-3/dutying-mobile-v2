import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { View, Text, Pressable, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CheckIcon from '@/assets/svgs/check.svg';
import EditIcon from '@/assets/svgs/edit-shift-type-gray.svg';
import TrashIcon from '@/assets/svgs/trash-color.svg';
import LottieLoading from '@/components/LottieLoading';
import MonthSelector from '@/components/MonthSelector';
import PageHeader from '@/components/PageHeader';
import PageViewContainer from '@/components/PageView';
import ShiftBadge from '@/components/ShiftBadge';
import { days, isSameDate } from '@/utils/date';
import { COLOR } from '@/styles';
import useRegistDuty from './index.hook';

const RegistDuty = () => {
  const {
    state: { isLoading, date, weeks, selectedDate, shiftTypes, shiftTypesCount, shiftTypeButtons },
    actions: {
      insertShift,
      deleteShift,
      selectDate,
      saveRegistDutyChange,
      navigateToShiftType,
      longPressShift,
    },
  } = useRegistDuty();

  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <PageHeader
            title="근무 등록"
            rightItems={
              <TouchableOpacity onPress={saveRegistDutyChange}>
                <CheckIcon />
              </TouchableOpacity>
            }
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 22,
                paddingTop: 20,
                paddingBottom: 12,
              }}
            >
              <MonthSelector />
            </View>
            <View style={styles.calendarHeaderView}>
              {days.map((day) => (
                <View key={day} style={styles.dayView}>
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: day === '일' ? '#FF99AA' : day === '토' ? '#8B9BFF' : COLOR.sub25,
                      },
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              ))}
            </View>
            {weeks.map((week, i) => (
              <View key={i} style={styles.weekView}>
                {week.map((day) => {
                  const isSame = isSameDate(selectedDate, day.date);
                  const isSameMonth = date.getMonth() === day.date.getMonth();
                  return (
                    <Pressable
                      key={day.date.getTime()}
                      style={{
                        flex: 1,
                        height: 67,
                      }}
                      onPress={() => selectDate(day.date)}
                    >
                      <View
                        style={[
                          styles.dateView,
                          {
                            backgroundColor: isSame ? COLOR.sub5 : 'white',
                          },
                        ]}
                      >
                        <Text style={[styles.dateText, { opacity: isSameMonth ? 1 : 0.3 }]}>
                          {day.date.getDate()}
                        </Text>
                        <ShiftBadge
                          date={day.date.getDate()}
                          shift={day.shift !== null ? shiftTypes.get(day.shift) : undefined}
                          isCurrent={isSameMonth}
                          isToday={isSame}
                          fullNameVisibilty
                        />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}
            <View style={styles.registView}>
              <View style={styles.registHeaderView}>
                <Text style={styles.registHeaderText}>근무 유형 선택</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={navigateToShiftType}
                    style={{ marginRight: 8, padding: 4 }}
                  >
                    <EditIcon />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={deleteShift} style={{ padding: 4 }}>
                    <View style={styles.deleteShiftView}>
                      <Text style={styles.deleteShiftText}>삭제</Text>
                      <TrashIcon />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {shiftTypeButtons.map((shiftTypeList, i) => {
                return (
                  <View
                    key={shiftTypeList[0]?.accountShiftTypeId + `${i}`}
                    style={styles.registShiftItemsView}
                  >
                    {shiftTypeList.map((shift) => {
                      if (shift)
                        return (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            key={shift.accountShiftTypeId}
                            onPress={() => insertShift(shift.accountShiftTypeId)}
                            delayLongPress={700}
                            onLongPress={() => longPressShift(shift)}
                            style={styles.shiftItemView}
                          >
                            <Text style={styles.shiftCountText}>
                              {shiftTypesCount.get(shift.accountShiftTypeId) || 0}
                            </Text>
                            <View style={[styles.shiftView, { backgroundColor: shift.color }]}>
                              <Text style={styles.shiftShortNameText}>{shift.shortName}</Text>
                              <Text style={styles.shiftFullNameText}>{shift.name}</Text>
                            </View>
                          </TouchableOpacity>
                        );
                      else return <View style={styles.shiftItemView} />;
                    })}
                  </View>
                );
              })}
            </View>
            <View style={{ height: 150 }} />
          </ScrollView>
        </SafeAreaView>
        {isLoading && <LottieLoading />}
      </BottomSheetModalProvider>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  calendarHeaderView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#d6d6de',
  },
  dayView: { flex: 1, marginVertical: 10, justifyContent: 'center', alignItems: 'center' },
  dayText: {
    fontFamily: 'Apple',
    fontSize: 12,
  },
  weekView: { flexDirection: 'row', borderColor: '#d6d6de', borderTopWidth: 0.5 },
  dateView: { flex: 1, height: 67 },
  dateText: {
    marginLeft: 10,
    marginTop: 4,
    fontFamily: 'Poppins500',
    fontSize: 12,
    color: COLOR.sub2,
  },
  registView: {
    height: '100%',
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#fdfcfe',
  },
  registHeaderView: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  registHeaderText: { fontSize: 14, fontFamily: 'Apple', color: COLOR.sub2 },
  deleteShiftView: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLOR.main2,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  deleteShiftText: { fontSize: 12, fontFamily: 'Apple', color: COLOR.main2 },
  registShiftItemsView: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'flex-start',
  },
  shiftItemView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  shiftCountText: { fontFamily: 'Poppins', color: COLOR.sub25, fontSize: 12 },
  shiftView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 18,
    width: 80,
    paddingVertical: 3,
    borderRadius: 10,
  },
  shiftShortNameText: { color: 'white', fontFamily: 'Apple600', fontSize: 20, height: 29 },
  shiftFullNameText: { marginLeft: 5, color: 'white', fontFamily: 'Apple', fontSize: 14 },
});

export default RegistDuty;
