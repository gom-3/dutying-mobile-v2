import { useLinkProps, useLinkTo } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useMemo, useRef } from 'react';
import { Alert, BackHandler, Platform } from 'react-native';
import { type ICarouselInstance } from 'react-native-reanimated-carousel';
import { type Schedule } from '@/hooks/useDeviceCalendar';
import { useCaledarDateStore } from '@/stores/calendar';
import { useDeviceCalendarStore } from '@/stores/device';
import { useScheduleStore } from '@/stores/schedule';
import { useShiftTypeStore } from '@/stores/shift';
import { isSameDate } from '@/utils/date';
import { firebaseLogEvent } from '@/utils/event';

const useScheduleCard = (isCardOpen: boolean) => {
  const { date, calendar, cardDefaultIndex, setState } = useCaledarDateStore();
  const [initStateCreate, initStateEdit] = useScheduleStore((state) => [
    state.initStateCreate,
    state.initStateEdit,
  ]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [deviceCalendar, calendarLink] = useDeviceCalendarStore((state) => [
    state.calendars,
    state.calendarLink,
  ]);
  const linkTo = useLinkTo();
  const { onPress: onPressEditScheduleButton } = useLinkProps({
    screen: 'RegistSchedule',
    params: { isEdit: true },
  });
  const { onPress: onPressRegistShiftButton } = useLinkProps({
    screen: 'RegistDuty',
    params: { dateFrom: date.toISOString() },
  });
  const carouselRef = useRef<ICarouselInstance>(null);
  const year = date.getFullYear();
  const month = date.getMonth();

  const filteredDeviceCalendar = useMemo(
    () =>
      deviceCalendar.filter(
        (calendar) => calendarLink[calendar.id] && calendar.allowsModifications === true,
      ),
    [],
  );

  const backDropPressHandler = () => {
    setState('isCardOpen', false);
  };

  const editShiftPressHandler = () => {
    firebaseLogEvent('move_regist_duty_specific');
    onPressRegistShiftButton();
  };

  const addSchedulePressHandler = () => {
    firebaseLogEvent('move_regist_schedule');
    if (filteredDeviceCalendar.length === 0) {
      firebaseLogEvent('schedule_calendar_null');
      Alert.alert('기기에 수정 가능한 캘린더가 없습니다.');
    } else {
      initStateCreate(date);
      linkTo('RegistSchedule');
    }
  };

  const editSchedulePressHandler = (schedule: Schedule) => {
    if (schedule.editbale) {
      firebaseLogEvent('move_edit_schedule');
      initStateEdit(schedule);
      onPressEditScheduleButton();
    }
  };

  const changeDate = (index: number) => {
    const first = new Date(year, month, 1).getDay();
    const newDate = new Date(calendar[index + first].date);
    setState('date', newDate);
  };

  const thisMonthDefaultIndex = useMemo(() => {
    const first = new Date(year, month, 1).getDay();
    return cardDefaultIndex - first;
  }, [cardDefaultIndex, month, year]);

  const thisMonthCalendar = useMemo(() => {
    return calendar.filter((cell) => cell.date.getMonth() === date.getMonth());
  }, [calendar]);

  useEffect(() => {
    const first = new Date(year, month, 1).getDay();
    const index = calendar.findIndex((c) => isSameDate(c.date, date));
    carouselRef?.current?.scrollTo({ index: index - first, animated: false });
  }, [calendar]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, []);

  useEffect(() => {
    if (isCardOpen)
      BackHandler.addEventListener('hardwareBackPress', () => {
        setState('isCardOpen', false);
        return true;
      });
    else
      BackHandler.removeEventListener('hardwareBackPress', () => {
        setState('isCardOpen', false);
        return true;
      });
  }, [isCardOpen]);

  return {
    state: {
      carouselRef,
      thisMonthDefaultIndex,
      thisMonthCalendar,
      shiftTypes,
    },
    actions: {
      editShiftPressHandler,
      backDropPressHandler,
      addSchedulePressHandler,
      editSchedulePressHandler,
      changeDate,
    },
  };
};

export default useScheduleCard;
