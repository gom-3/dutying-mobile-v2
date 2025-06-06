import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
  Image,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import MonthSelector from '@/components/MonthSelector';
import { type Summary, type Collection } from '@/types/moim';
import { days, isSameDate } from '@/utils/date';
import { COLOR, screenWidth } from '@/styles';
import useSummary from './index.hook';
import MoimShift from './Shift';

const Classification = ['day', 'evening', 'night', 'off'];
const countEnum = ['가장', '두 번째', '세 번째', '네 번째'];

interface Props {
  collection: Collection;
}

const Summary = ({ collection }: Props) => {
  const {
    states: {
      selectedClassification,
      index,
      date,
      shiftTypes,
      summaryDate,
      selectedShiftTypeName,
      weeks,
      summary,
      datas,
      threeDates,
    },
    actions: { pressShiftTypeHandler, setPage, pressDate, setState, getIndexFromDate },
  } = useSummary({ collection });

  const renderItem = ({ item, index }: { item: Summary; index: number }) => {
    return (
      <View style={styles.card} key={`card${index}`}>
        <View style={styles.cardContent}>
          <Text style={styles.cardHeaderText}>
            {countEnum[index]} 많이 겹치는 {selectedShiftTypeName?.name}
          </Text>
          <Text style={styles.cardNumberText}>
            {item.count}/{collection.memberViews.length}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardDateText}>
            {+item.date.slice(5, 7)}월 {+item.date.slice(8)}일 {days[new Date(item.date).getDay()]}
          </Text>
          <View style={styles.cardNames}>
            {item.names.map((name, i) => (
              <View style={styles.cardName} key={`${index} ${i} ${name}`}>
                <Text style={styles.cardNameText}>{name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={{ backgroundColor: COLOR.bg }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={{ flex: 0.7 }}>
          <MonthSelector />
        </View>
        <ScrollView horizontal style={styles.shiftTypes} showsHorizontalScrollIndicator={false}>
          {Array.from(shiftTypes.values())
            .filter((shiftType) => Classification.includes(shiftType.classification.toLowerCase()))
            .map((type) => (
              <TouchableOpacity
                key={`shiftType${type.accountShiftTypeId}`}
                activeOpacity={0.7}
                style={[
                  styles.shiftType,
                  {
                    backgroundColor:
                      selectedClassification === type.classification.toLowerCase()
                        ? COLOR.main4
                        : 'white',
                    borderColor:
                      selectedClassification === type.classification.toLowerCase()
                        ? COLOR.main1
                        : COLOR.main2,
                  },
                ]}
                onPress={() => pressShiftTypeHandler(type.classification.toLowerCase())}
              >
                <Text
                  style={[
                    styles.shiftTypeText,
                    {
                      color:
                        selectedClassification === type.classification.toLowerCase()
                          ? COLOR.main1
                          : COLOR.main2,
                    },
                  ]}
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
      {datas.length > 0 && (
        <Carousel
          onSnapToItem={(index) => {
            setPage(index);
            setState('date', new Date(summary[index].date));
            getIndexFromDate(new Date(summary[index].date));
          }}
          data={datas}
          width={screenWidth}
          height={110}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.85,
            parallaxScrollingOffset: 80,
          }}
          loop={false}
          renderItem={renderItem}
          windowSize={3}
        />
      )}
      <View>
        <View style={styles.days}>
          {days.map((day) => (
            <View style={styles.day} key={day}>
              <Text
                style={[
                  styles.dayText,
                  {
                    color: day === '일' ? '#ff99aa' : day === '토' ? '#8b9bff' : COLOR.sub25,
                  },
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
        {weeks.map((week, i) => (
          <View key={`week${i}`} style={styles.week}>
            {week.map((day, j) => {
              const isToday = isSameDate(date, day);
              const isSummaryDate = isSameDate(summaryDate, day);
              return (
                <TouchableOpacity
                  onPress={() => pressDate(day, i * 7 + j)}
                  key={`${day.getMonth()}.${day.getDate()}`}
                  style={styles.dateWrapper}
                >
                  <View
                    style={[
                      styles.date,
                      {
                        backgroundColor: isSummaryDate
                          ? COLOR.main1
                          : isToday
                            ? COLOR.sub3
                            : COLOR.bg,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        {
                          color:
                            day.getMonth() === date.getMonth()
                              ? isToday || isSummaryDate
                                ? 'white'
                                : COLOR.sub2
                              : COLOR.sub4,
                        },
                      ]}
                    >
                      {day.getDate()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.membersShift}>
        <Text style={styles.membersShiftDate}>
          {date.getMonth() + 1}월 {date.getDate()}일, {days[date.getDay()]}
        </Text>
        <View style={styles.memberShiftDateList}>
          {index - 1 >= 0 && (
            <Text style={styles.memberShiftDateBlur}>
              {threeDates[0].getMonth() + 1}월 {threeDates[0].getDate()}일
            </Text>
          )}
          <Text style={styles.memberShiftDateFoucs}>
            {threeDates[1].getMonth() + 1}월 {threeDates[1].getDate()}일
          </Text>
          {index + 1 <= collection.memberViews[0].accountShiftTypes.length && (
            <Text style={styles.memberShiftDateBlur}>
              {threeDates[2].getMonth() + 1}월 {threeDates[2].getDate()}일
            </Text>
          )}
        </View>
        {collection.memberViews.map((member) => (
          <View key={`name ${member.accountId}`} style={styles.member}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.memberProfile}
                source={{ uri: `data:image/png;base64,${member.profileImgBase64}` }}
              />
              <Text style={styles.memberName}>{member.name}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {index - 1 >= 0 && <MoimShift shift={member.accountShiftTypes[index - 1]} />}
              <MoimShift shift={member.accountShiftTypes[index]} isToday />
              {index + 1 <= collection.memberViews[0].accountShiftTypes.length && (
                <MoimShift shift={member.accountShiftTypes[index + 1]} />
              )}
            </View>
          </View>
        ))}
      </View>
      <View style={{ height: 150, backgroundColor: 'white' }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 24,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shiftTypes: {
    flex: 2,
    flexDirection: 'row',
  },
  shiftType: {
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 5,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  shiftTypeText: {
    fontFamily: 'Apple500',
    fontSize: 12,
  },
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderColor: COLOR.main4,
    borderWidth: 0.5,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 32,
    width: screenWidth,
    shadowColor: Platform.OS === 'android' ? '#b497ee' : '#ede9f5',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  cardContent: {
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNames: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  cardName: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 20,
    backgroundColor: COLOR.main4,
    marginLeft: 3,
    marginBottom: 2,
  },
  cardNameText: {
    fontFamily: 'Apple',
    fontSize: 11,
    color: COLOR.sub2,
  },
  cardHeaderText: {
    color: COLOR.sub2,
    fontFamily: 'Apple',
    fontSize: 11,
  },
  cardNumberText: {
    color: COLOR.sub25,
    fontFamily: 'Poppins',
    fontSize: 11,
  },
  cardDateText: {
    fontFamily: 'Apple600',
    fontSize: 22,
    color: COLOR.sub1,
    flex: 1,
  },
  days: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.sub4,
    paddingBottom: 8,
  },
  day: { flex: 1, alignItems: 'center' },
  dayText: { fontFamily: 'Apple', fontSize: 12 },
  week: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 24,
    height: 55,
    marginTop: 2,
  },
  dateWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  date: {
    width: 26,
    height: 26,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Apple500',
    fontSize: 12,
  },
  membersShift: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    shadowColor: 'rgba(210, 199, 231, 0.50)',
    shadowOpacity: 1,
    shadowRadius: 22,
    paddingBottom: 50,
  },
  membersShiftDate: {
    marginTop: 16,
    marginLeft: 24,
    fontFamily: 'Apple500',
    fontSize: 20,
    color: COLOR.sub1,
    marginBottom: 14,
  },
  memberShiftDateList: { flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 24 },
  memberShiftDateFoucs: {
    width: 58,
    fontFamily: 'Apple600',
    color: COLOR.main1,
    fontSize: 12,
    textAlign: 'center',
  },
  memberShiftDateBlur: {
    width: 58,
    fontFamily: 'Apple500',
    color: COLOR.sub3,
    fontSize: 12,
    textAlign: 'center',
  },
  member: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 13,
    alignItems: 'center',
    borderBottomColor: COLOR.sub45,
    borderBottomWidth: 0.5,
  },
  memberProfile: { width: 24, height: 24, marginRight: 8, borderRadius: 50 },
  memberName: { color: COLOR.sub2, fontFamily: 'Apple500', fontSize: 16 },
});

export default Summary;
