import { type Frequency, type Alarm, type RecurrenceRule } from 'expo-calendar';
import { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheetHeader from '@/components/BottomSheetHeader';
import { useScheduleStore } from '@/stores/schedule';
import { alarmList, getRecurrenceRuleList } from '@/utils/event';
import { COLOR } from '@/styles';

interface Props {
  closeModal: () => void;
}

const ModalContext = ({ closeModal }: Props) => {
  const [modalName, alarmText, recurrenceRuleText, startDate, setState] = useScheduleStore(
    (state) => [
      state.modalName,
      state.alarmText,
      state.recurrenceRuleText,
      state.startDate,
      state.setState,
    ],
  );

  const recurrenceRuleList = useMemo(() => getRecurrenceRuleList(startDate), [startDate]);

  const setAlarm = (text: string, time: number) => {
    const alarm: Alarm = { relativeOffset: time };
    setState('alarms', [alarm]);
    setState('alarmText', text);
    closeModal();
  };

  const setRepeat = (text: string, frequency: Frequency) => {
    const recurrenceRule: RecurrenceRule = { frequency };
    setState('recurrenceRule', recurrenceRule);
    setState('recurrenceRuleText', text);
    closeModal();
  };

  if (modalName === 'alarm')
    return (
      <View style={styles.container}>
        <BottomSheetHeader title="알람" onPressExit={closeModal} />
        {alarmList.map((alarm) => (
          <TouchableOpacity
            key={alarm.text}
            style={styles.item}
            onPress={() => setAlarm(alarm.text, alarm.time)}
          >
            <Text
              style={[
                styles.itemText,
                {
                  color: alarmText === alarm.text ? COLOR.main1 : COLOR.sub2,
                  fontFamily: alarmText === alarm.text ? 'Apple600' : 'Apple',
                  textDecorationLine: alarmText === alarm.text ? 'underline' : 'none',
                },
              ]}
            >
              {alarm.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  else
    return (
      <View style={styles.container}>
        <BottomSheetHeader title="반복" onPressExit={closeModal} />
        {recurrenceRuleList.map((recurrenceRule) => (
          <TouchableOpacity
            key={recurrenceRule.text}
            style={styles.item}
            onPress={() => setRepeat(recurrenceRule.text, recurrenceRule.frequency)}
          >
            <Text
              style={[
                styles.itemText,
                {
                  color: recurrenceRuleText === recurrenceRule.text ? COLOR.main1 : COLOR.sub2,
                  fontFamily: recurrenceRuleText === recurrenceRule.text ? 'Apple600' : 'Apple',
                  textDecorationLine:
                    recurrenceRuleText === recurrenceRule.text ? 'underline' : 'none',
                },
              ]}
            >
              {recurrenceRule.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
  },
  item: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'Apple500',
  },
});

export default ModalContext;
