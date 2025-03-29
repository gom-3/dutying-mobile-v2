import { useQuery } from '@tanstack/react-query';
import { getEventsAsync } from 'expo-calendar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { getAccountShiftList } from '@/api/shift';
import { type ISchedule } from '@/hooks/useDeviceCalendar';
import { type TDateData } from '@/pages/HomePage/components/Calendar';
import { useAccountStore } from '@/stores/account';
import { useDeviceCalendarStore } from '@/stores/device';
import { type Shift } from '@/types/shift';
import { dateDiffInDays } from '@/utils/date';
import { firebaseLogEvent } from '@/utils/event';
import { handleWidgetData } from './handler';
import { getItem, reloadAll, setItem } from '../../../modules/widget';

const GROUP_NAME = 'group.expo.modules.widgetsync.data';

const getSharedData = getItem(GROUP_NAME);
const setSharedData = setItem(GROUP_NAME);

function useWidget({ shiftTypes }: { shiftTypes: Map<number, Shift> }) {
  const {
    account: { accountId },
  } = useAccountStore();
  const { calendars, calendarLink } = useDeviceCalendarStore();
  const [widgetData, setWidgetData] = useState(getSharedData(GROUP_NAME) ?? '');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const { data: shiftListResponse } = useQuery({
    queryKey: ['shiftForwidget', year, month],
    queryFn: () => getAccountShiftList(accountId, year, month),
    enabled: accountId > 0,
  });

  const getEventFromDevice = async (calendar: TDateData[]) => {
    const first = new Date(year, month, 1);
    const last =
      Platform.OS === 'android' ? new Date(year, month + 1, 10) : new Date(year, month + 1, 1);
    const idList = calendars
      .filter((calendar) => calendarLink[calendar.id])
      .map((calendar) => calendar.id);
    if (idList.length === 0) return;
    let events = await getEventsAsync(idList, first, last);
    if (Platform.OS === 'android') {
      events = events.filter((event) => new Date(event.startDate).getMonth() === month);
    }
    const newCalendar = [...calendar];
    newCalendar.forEach((date) => (date.schedules = []));
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
        calendars.find((calendar) => calendar.id === event.calendarId)?.color || '#5AF8F8';
      let level;
      let endIndex = first.getDay() + eventEndDate.getDate() - 1;

      /**
       * 이전 달에서 이번 달로 이어지는 Event, 이번 달에서 다음 달로 이어지는 Event
       * 이전 년도에서 이번 년도로 이어지는 Event, 이번 년도에서 다음 년도로 이어지는 Event
       * index 예외처리
       */
      if (eventEndDate.getMonth() > month || eventEndDate.getFullYear() > year)
        endIndex += new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), 0).getDate();

      if (eventStartDate.getMonth() < month || eventStartDate.getFullYear() < year)
        startIndex -= new Date(year, month + 1, 0).getDate();

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
          const schedule = {
            ...event,
            startTime: eventStartDate,
            endTime: eventEndDate,
            color: color,
          } as ISchedule;
          const schedules = [...newCalendar[i].schedules];
          schedules.push(schedule);
          newCalendar[i].schedules = schedules;
        }
        index = index + jump;
      }
    });
    return newCalendar;
  };

  const initCalendar = async (year: number, month: number) => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    let calendar: TDateData[] = [];
    let dateIndex = 0;

    const shiftList = shiftListResponse?.accountShiftTypeIdList;
    for (let i = first.getDay() - 1; i >= 0; i--) {
      const date: TDateData = {
        date: new Date(year, month, -i),
        shift: shiftList ? shiftList[dateIndex++] : null,
        schedules: [],
      };
      calendar.push(date);
    }
    for (let i = 1; i <= last.getDate(); i++) {
      const date: TDateData = {
        date: new Date(year, month, i),
        shift: shiftList ? shiftList[dateIndex++] : null,
        schedules: [],
      };
      calendar.push(date);
    }
    for (let i = last.getDay(), j = 1; i < 6; i++, j++) {
      const date: TDateData = {
        date: new Date(year, month + 1, j),
        shift: shiftList ? shiftList[dateIndex++] : null,
        schedules: [],
      };
      calendar.push(date);
    }

    calendar = (await getEventFromDevice(calendar)) || calendar;

    const weeks: TDateData[][] = [];
    const temp = [...calendar];
    while (temp.length > 0) weeks.push(temp.splice(0, 7));

    const widgetData = handleWidgetData(year, month + 1, weeks, shiftTypes);
    setWidgetData(JSON.stringify(widgetData));
  };

  useEffect(() => {
    firebaseLogEvent('widget_init');
    if (shiftListResponse && shiftTypes) {
      initCalendar(year, month);
    }
  }, [year, month, shiftListResponse, shiftTypes]);

  useEffect(() => {
    firebaseLogEvent('widget_reload');
    if (widgetData) {
      console.log(JSON.stringify(JSON.parse(widgetData).today));
      setSharedData('savedData', widgetData);
      reloadAll();
    }
  }, [widgetData]);
}

export default useWidget;
