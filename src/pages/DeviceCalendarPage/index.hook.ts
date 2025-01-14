import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { type RouteProp, useRoute } from '@react-navigation/native';
import {
  Availability,
  type Calendar,
  CalendarAccessLevel,
  CalendarType,
  EntityTypes,
  createCalendarAsync,
  updateCalendarAsync,
  deleteCalendarAsync,
  requestCalendarPermissionsAsync,
} from 'expo-calendar';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useCaledarDateStore } from '@/stores/calendar';
import { useDeviceCalendarStore } from '@/stores/device';
import { firebaseLogEvent } from '@/utils/event';

const useDeviceCalendarPage = () => {
  const [calendars, dutyingCalendars, calendarLink, setLink, setState] = useDeviceCalendarStore(
    (state) => [
      state.calendars,
      state.dutyingCalendars,
      state.calendarLink,
      state.setLink,
      state.setState,
    ],
  );
  const { params } = useRoute<RouteProp<{ params: { isRedirected: boolean } }>>();

  const [setScheduleState] = useCaledarDateStore((state) => [state.setState]);
  const [isValid, setIsValid] = useState({ name: true, color: true });
  const [color, setColor] = useState('');
  const [name, setName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState('');

  const textRef = useRef<string>('');
  const ref = useRef<BottomSheetModal>(null);

  const normalCalendars = calendars.filter((calendar) => !calendar.title?.startsWith('듀팅'));
  const pressLinkHandler = (id: string) => {
    firebaseLogEvent('link_calendar');
    setLink(id, !calendarLink[id]);
    setScheduleState('isScheduleUpdated', true);
  };

  const openModalCreateMode = () => {
    firebaseLogEvent('add_calendar');
    ref.current?.present();
    setColor('');
    setIsEdit(false);
    textRef.current = '';
  };

  const openModalEditMode = (calendar: Calendar) => {
    firebaseLogEvent('edit_calendar');
    ref.current?.present();
    setColor(calendar.color);
    setName(calendar.title.slice(3));
    textRef.current = calendar.title.slice(3);
    setId(calendar.id);
    setIsEdit(true);
  };

  const createCalendar = async () => {
    await requestCalendarPermissionsAsync();
    if (textRef.current.length > 0 && color.length > 0) {
      try {
        if (!isEdit) {
          await createCalendarAsync({
            accessLevel: CalendarAccessLevel.OWNER,
            ownerAccount: 'Dutying',
            name: textRef.current,
            id: textRef.current,
            allowsModifications: true,
            title: `듀팅-${textRef.current}`,
            color: color,
            allowedAvailabilities: [Availability.BUSY, Availability.FREE],
            source: { name: 'dutying', type: CalendarType.LOCAL, id: 'Dutying' },
            entityType: EntityTypes.EVENT,
          });
        } else {
          await updateCalendarAsync(id, {
            title: `듀팅-${textRef.current}`,
            color: color,
          });
        }
        setState('isChanged', true);
      } catch {
        Alert.alert(
          '권한 거부됨',
          '해당 기기에서 캘린더를 생성/수정 할 수 없습니다. 기기 설정을 확인해 주세요.',
        );
      }

      ref.current?.close();
    } else {
      if (textRef.current.length === 0) {
        setIsValid((prev) => ({ ...prev, name: false }));
      }
      if (color.length === 0) {
        setIsValid((prev) => ({ ...prev, color: false }));
      }
    }
  };

  const deleteCalendar = async () => {
    firebaseLogEvent('delete_calendar');
    await deleteCalendarAsync(id);
    setState('isChanged', true);
    ref.current?.close();
  };

  useEffect(() => {
    if (ref.current && params && params.isRedirected) ref.current.present();
  }, [params, ref]);

  return {
    states: {
      isValid,
      textRef,
      isEdit,
      color,
      name,
      ref,
      normalCalendars,
      dutyingCalendars,
      calendarLink,
    },
    actions: {
      setColor,
      pressLinkHandler,
      openModalCreateMode,
      openModalEditMode,
      createCalendar,
      deleteCalendar,
      setIsValid,
    },
  };
};

export default useDeviceCalendarPage;
