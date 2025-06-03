import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useRef } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import BottomSheetHeader from '@/components/BottomSheetHeader';
import { COLOR } from '@/styles';

interface Props {
  date: Date;
  onChange: (_: DateTimePickerEvent, selectedDate: Date | undefined) => void;
  mode: 'date' | 'time' | 'datetime';
  text?: string;
  style?: StyleProp<ViewStyle>;
}

const DatePicker = ({ date, mode, text, style, onChange }: Props) => {
  const ref = useRef<BottomSheetModal>(null);

  const onPressTime = () => {
    Keyboard.dismiss();
    const androidMode = mode === 'datetime' ? 'date' : mode;
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        onChange: (_, selectedDate) => onChange(_, selectedDate),
        mode: androidMode,
      });
    } else {
      ref.current?.present();
    }
  };

  return (
    <View>
      <Pressable style={style} onPress={onPressTime}>
        <Text style={styles.usingItemTitle}>{text}</Text>
        <View style={styles.usingItemWrapper}>
          <Text style={styles.usingItemText}>
            {mode === 'date'
              ? `${date.getMonth() + 1}월 ${date.getDate()}일`
              : `${date.getHours().toString().padStart(2, '0')}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}`}
          </Text>
        </View>
      </Pressable>
      {Platform.OS === 'ios' && (
        <BottomSheetModal
          style={{ padding: 14 }}
          ref={ref}
          index={1}
          enableContentPanningGesture={false}
          snapPoints={[100, 300]}
          handleComponent={null}
          backdropComponent={BottomSheetBackdrop}
          onChange={(index) => {
            if (index !== 1) ref.current?.close();
          }}
        >
          <BottomSheetView style={{ flex: 1 }}>
            <BottomSheetHeader
              style={{ marginBottom: 0 }}
              onPressExit={() => ref.current?.close()}
            />
            <DateTimePicker
              minuteInterval={5}
              mode={mode}
              display="spinner"
              value={date}
              onChange={onChange}
            />
          </BottomSheetView>
        </BottomSheetModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  usingItemTitle: { fontFamily: 'Apple', fontSize: 10, color: COLOR.sub3, marginBottom: 4 },
  usingItemWrapper: { flexDirection: 'row' },
  usingItemText: {
    backgroundColor: COLOR.bg,
    borderRadius: 5,
    borderColor: COLOR.sub5,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    color: COLOR.sub1,
    paddingVertical: 4,
    fontFamily: 'Apple',
  },
});

export default DatePicker;
