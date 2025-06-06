import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { type Calendar } from 'expo-calendar';
import { useEffect, useMemo, useRef } from 'react';
import { Keyboard } from 'react-native';
import { useDeviceCalendarStore } from '@/stores/device';
import { useScheduleStore } from '@/stores/schedule';
import { navigate } from '@/utils/navigate';

const useCategory = () => {
  const [deviceCalendar, calendarLink] = useDeviceCalendarStore((state) => [
    state.calendars,
    state.calendarLink,
  ]);

  const [calendarId, setState] = useScheduleStore((state) => [state.calendarId, state.setState]);

  const navigateEditDeviceCalendar = () => {
    navigate('DeviceCalendar', { isRedirected: true });
  };

  const filteredDeviceCalendar = useMemo(
    () =>
      deviceCalendar.filter(
        (calendar) => calendarLink[calendar.id] && calendar.allowsModifications === true,
      ),
    [],
  );
  const ref = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (calendarId === '') setState('calendarId', filteredDeviceCalendar[0].id);
  }, []);
  const selectedCalendar = useMemo(
    () =>
      filteredDeviceCalendar.find((calendar) => calendar.id === calendarId) || deviceCalendar[0],
    [calendarId],
  );

  const openModal = () => {
    Keyboard.dismiss();
    ref.current?.present();
  };

  const pressCategoryHandler = (calendar: Calendar) => {
    if (calendarId !== calendar.id) {
      setState('prevCalendarId', calendarId);
      setState('calendarId', calendar.id);
    }
    ref.current?.close();
  };

  return {
    states: { deviceCalendar, filteredDeviceCalendar, selectedCalendar, ref },
    actions: { openModal, pressCategoryHandler, navigateEditDeviceCalendar },
  };
};

export default useCategory;
