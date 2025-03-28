import {
  type Event,
  type Calendar,
  createCalendarAsync,
  getEventsAsync,
  requestCalendarPermissionsAsync,
  getCalendarsAsync,
  Availability,
  CalendarType,
  EntityTypes,
  CalendarAccessLevel,
} from 'expo-calendar';
import { useEffect, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { useCaledarDateStore } from '@/stores/calendar';
import { useDeviceCalendarStore } from '@/stores/device';
import { dateDiffInDays } from '@/utils/date';

export interface ISchedule extends Event {
  level: number;
  isStart: boolean;
  isEnd: boolean;
  startTime: Date;
  endTime: Date;
  leftDuration: number;
  color: string;
  editbale: boolean;
}

const useDeviceCalendar = () => {
  const [date, calendar, isScheduleUpdated, setState] = useCaledarDateStore((state) => [
    state.date,
    state.calendar,
    state.isScheduleUpdated,
    state.setState,
  ]);
  const [deviceCalendar, calendarLinks, isCalendarChanged, setDeivceCalendar] =
    useDeviceCalendarStore((state) => [
      state.calendars,
      state.calendarLink,
      state.isChanged,
      state.setState,
    ]);

  const [granted, setGranted] = useState(false);

  const getEventFromDevice = async () => {
    if (!granted) return;

    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const last =
      Platform.OS === 'android' ? new Date(year, month + 1, 10) : new Date(year, month + 1, 1);
    const idList = deviceCalendar
      .filter((calendar) => calendarLinks[calendar.id])
      .map((calendar) => calendar.id);
    if (idList.length === 0) return;
    let events = await getEventsAsync(idList, first, last);
    if (Platform.OS === 'android') {
      events = events.filter((event) => new Date(event.startDate).getMonth() === date.getMonth());
    }
    const newCalendar = [...calendar];
    if (isScheduleUpdated) {
      newCalendar.forEach((date) => (date.schedules = []));
    }
    events = events.sort(
      (a, b) =>
        dateDiffInDays(new Date(b.startDate), new Date(b.endDate)) -
        dateDiffInDays(new Date(a.startDate), new Date(a.endDate)),
    );

    events.forEach((event) => {
      const eventStartDate = new Date(event.startDate);
      let eventEndDate = new Date(event.endDate);
      if (event.allDay && Platform.OS === 'android')
        eventEndDate = new Date(
          eventEndDate.getFullYear(),
          eventEndDate.getMonth(),
          eventEndDate.getDate() - 1,
        );
      let startIndex = first.getDay() + eventStartDate.getDate() - 1;
      const color =
        deviceCalendar.find((calendar) => calendar.id === event.calendarId)?.color || '#5AF8F8';
      let level;
      let endIndex = first.getDay() + eventEndDate.getDate() - 1;

      /**
       * 이전 달에서 이번 달로 이어지는 Event, 이번 달에서 다음 달로 이어지는 Event
       * 이전 년도에서 이번 년도로 이어지는 Event, 이번 년도에서 다음 년도로 이어지는 Event
       * index 예외처리
       */
      if (
        eventEndDate.getMonth() > date.getMonth() ||
        eventEndDate.getFullYear() > date.getFullYear()
      )
        endIndex += new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), 0).getDate();

      if (
        eventStartDate.getMonth() < date.getMonth() ||
        eventStartDate.getFullYear() < date.getFullYear()
      )
        startIndex -= new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

      if (endIndex > newCalendar.length - 1) endIndex = newCalendar.length - 1;
      let index = Math.max(0, startIndex);
      while (index <= endIndex) {
        const occupiedLevels = new Set();
        let jump = 0;
        for (let i = index; i <= endIndex; i++) {
          const schedules = newCalendar[i].schedules;
          jump++;
          schedules.forEach((schedule) => occupiedLevels.add(schedule.level));
          if (newCalendar[i].date.getDay() == 6) break;
        }
        level = 1;
        while (occupiedLevels.has(level)) {
          level++;
        }
        for (let i = index; i < index + jump; i++) {
          const schedule: ISchedule = {
            ...event,
            startTime: eventStartDate,
            endTime: eventEndDate,
            level,
            color: color,
            isStart:
              eventStartDate.getMonth() === newCalendar[i].date.getMonth() &&
              eventStartDate.getDate() === newCalendar[i].date.getDate(),
            isEnd: eventEndDate.getDate() === newCalendar[i].date.getDate(),
            leftDuration: endIndex - i,
            editbale:
              deviceCalendar.find((calendar) => calendar.id === event.calendarId)
                ?.allowsModifications || false,
          };
          const schedules = [...newCalendar[i].schedules];
          schedules.push(schedule);
          newCalendar[i].schedules = schedules;
        }
        index = index + jump;
      }
    });
    setState('calendar', newCalendar);
  };

  const getPermissionFromDevice = async () => {
    const { status } = await requestCalendarPermissionsAsync();

    if (status === 'granted') {
      setGranted(true);
      let calendars = await getCalendarsAsync(EntityTypes.EVENT);

      const newMap: { [key: string]: boolean } = { ...calendarLinks };
      calendars.forEach((key) => {
        if (newMap[key.id] === undefined) {
          newMap[key.id] = true;
        }
      });
      setDeivceCalendar('calendarLink', newMap);

      let deviceDutyingCalendars = calendars.filter((calendar) =>
        calendar.title.startsWith('듀팅'),
      );
      if (deviceDutyingCalendars.length === 0) {
        try {
          await createCalendarAsync(newCalendars[0]);
          await createCalendarAsync(newCalendars[1]);
        } catch {
          Alert.alert(
            '권한 거부됨',
            '해당 기기에서 캘린더를 생성할 수 없습니다. 기기 설정을 확인해 주세요.',
          );
        }
        calendars = await getCalendarsAsync();
        calendars = calendars.filter((calendar) => calendar.allowsModifications === true);
        deviceDutyingCalendars = calendars.filter((calendar) => calendar.title.startsWith('듀팅'));
      }
      setDeivceCalendar('dutyingCalendars', deviceDutyingCalendars);
      setDeivceCalendar('calendars', calendars);

      // 권한이 승인된 후 이벤트를 가져옵니다
      await getEventFromDevice();
    } else {
      Alert.alert(
        '권한 거부됨',
        '캘린더 접근 권한이 거부되었습니다. 설정에서 권한을 허용해 주세요.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '설정으로 이동',
            onPress: () => {
              if (Platform.OS === 'ios') Linking.openURL('app-settings:');
              else Linking.openSettings();
            },
          },
        ],
      );
    }
  };

  useEffect(() => {
    getPermissionFromDevice();
  }, []);

  useEffect(() => {
    if (granted && isCalendarChanged) {
      getPermissionFromDevice();
      setDeivceCalendar('isChanged', false);
    }
  }, [granted, isCalendarChanged]);

  useEffect(() => {
    if (isScheduleUpdated && granted) {
      getEventFromDevice();
      setState('isScheduleUpdated', false);
    }
  }, [isScheduleUpdated, granted]);
};

const newCalendars: Partial<Calendar>[] = [
  {
    accessLevel: CalendarAccessLevel.OWNER,
    ownerAccount: 'Dutying',
    name: 'dutying-appointment',
    id: 'duyting-appointment',
    title: '듀팅-일정',
    allowsModifications: true,
    color: '#5af8f8',
    allowedAvailabilities: [Availability.BUSY, Availability.FREE],
    source: { name: 'dutying', type: CalendarType.LOCAL, id: 'Dutying' },
    entityType: EntityTypes.EVENT,
  },
  {
    accessLevel: CalendarAccessLevel.OWNER,
    ownerAccount: 'Dutying',
    name: 'dutying-appointment',
    id: 'duyting-appointment',
    title: '듀팅-할일',
    allowsModifications: true,
    color: '#F8E85A',
    allowedAvailabilities: [Availability.BUSY, Availability.FREE],
    source: { name: 'dutying', type: CalendarType.LOCAL, id: 'Dutying' },
    entityType: EntityTypes.EVENT,
  },
];

export default useDeviceCalendar;
