import { type ISchedule } from '@/hooks/useDeviceCalendar';
import { type TDateData } from '@/pages/HomePage/components/Calendar';
import { type Shift } from '@/types/shift';

export type WidgetDateType = {
  day: string; //03
  dayName: string; //금
  dayType: 'saturday' | 'sunday' | 'workday';
};

export type WidgetShift = {
  name: string;
  shortName: string;
  color: number; // 0xFFFFFF
  time: string; // 10:00 ~ 18:00
};

export type WidgetSchedule = {
  title: string;
  color: number; // 0xFFFFFF
  time: string; // HH:mm ~ HH:mm | -
};

export type WidgetData = {
  today: {
    date: WidgetDateType;
    shift: WidgetShift | null;
    schedules: WidgetSchedule[];
    closeSchedule: WidgetSchedule | null;
  };
  week: {
    period: string; // mm.dd ~ mm.dd
    shiftList: {
      date: WidgetDateType;
      shift: WidgetShift | null;
      isCurrentMonth: boolean;
    }[];
  };
  month: {
    year: number;
    month: number;
    startDayIndex: number;
    endDayIndex: number;
    calendar: {
      date: WidgetDateType;
      shift: WidgetShift | null;
      isCurrentMonth: boolean;
    }[][];
  };
};

export const dateToHHMM = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '00:00';
  }

  try {
    const h = date.getHours();
    const m = date.getMinutes();
    return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}`;
  } catch (error) {
    console.error('dateToHHMM 오류:', error);
    return '00:00';
  }
};

export const getDayName = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '월';
  }

  try {
    const week = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = week[date.getDay()];
    return dayOfWeek;
  } catch (error) {
    console.error('getDayName 오류:', error);
    return '월';
  }
};

export const dateToWidgetDateType = (date: Date): WidgetDateType => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return {
      day: '1',
      dayName: '월',
      dayType: 'workday',
    };
  }

  try {
    return {
      day: date.getDate().toString(),
      dayName: getDayName(date),
      dayType: date.getDay() === 0 ? 'sunday' : date.getDay() === 6 ? 'saturday' : 'workday',
    };
  } catch (error) {
    console.error('dateToWidgetDateType 오류:', error);
    return {
      day: '1',
      dayName: '월',
      dayType: 'workday',
    };
  }
};

export const shiftIdToWidgetShiftData = (
  shiftTypes: Map<number, Shift>,
  shiftId: number,
): WidgetShift | null => {
  try {
    if (!shiftTypes || !shiftId) return null;

    const shift = shiftTypes.get(shiftId);
    if (!shift) return null;

    // 색상 변환에서 발생할 수 있는 오류를 방어
    let color = 0;
    try {
      color = Number('0x' + shift.color.substring(1, shift.color.length));
      if (isNaN(color)) color = 0;
    } catch {
      color = 0;
    }

    const widgetShift: WidgetShift = {
      name: shift.name || '근무',
      shortName: shift.shortName || '근',
      color: color,
      time:
        shift.startTime === null || shift.endTime === null
          ? '-'
          : dateToHHMM(shift.startTime) + ' ~ ' + dateToHHMM(shift.endTime),
    };
    return widgetShift;
  } catch (error) {
    console.error('shiftIdToWidgetShiftData 오류:', error);
    return null;
  }
};

export const sheduleToWidgetSheduleData = (shedule: ISchedule): WidgetSchedule | null => {
  try {
    if (!shedule) return null;

    // 색상 변환에서 발생할 수 있는 오류를 방어
    let color = 0;
    try {
      color = Number('0x' + shedule.color.substring(1, shedule.color.length));
      if (isNaN(color)) color = 0;
    } catch {
      color = 0;
    }

    return {
      title: shedule.title || '일정',
      color: color,
      time: dateToHHMM(shedule.startTime) + ' ~ ' + dateToHHMM(shedule.endTime),
    };
  } catch (error) {
    console.error('sheduleToWidgetSheduleData 오류:', error);
    return null;
  }
};

export const findCloseSchedule = (schedules: ISchedule[]): WidgetSchedule | null => {
  try {
    if (!schedules || schedules.length === 0) return null;

    const now = new Date();
    const futureSchedules = schedules.filter((x) => x && x.startTime && x.startTime > now);

    if (futureSchedules.length === 0) return null;

    const schedule = futureSchedules.sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime(),
    )[0];
    return sheduleToWidgetSheduleData(schedule);
  } catch (error) {
    console.error('findCloseSchedule 오류:', error);
    return null;
  }
};

const makeMonth = (
  shiftList: {
    date: WidgetDateType;
    shift: WidgetShift | null;
    isCurrentMonth: boolean;
  }[],
) => {
  try {
    if (!shiftList || !Array.isArray(shiftList)) {
      return [[]];
    }

    let arr: {
      date: WidgetDateType;
      shift: WidgetShift | null;
      isCurrentMonth: boolean;
    }[][] = [];

    for (let i = 0; i < shiftList.length / 7; i++) {
      arr = [...arr, shiftList.slice(7 * i, 7 * i + 7)];
    }
    return arr;
  } catch (error) {
    console.error('makeMonth 오류:', error);
    return [[]];
  }
};

export const handleWidgetData = (
  year: number,
  month: number,
  weeks: TDateData[][],
  shiftTypes: Map<number, Shift>,
): WidgetData | undefined => {
  try {
    if (!weeks || !Array.isArray(weeks) || weeks.length === 0 || !shiftTypes) {
      console.warn('handleWidgetData: 필수 데이터 누락');
      return undefined;
    }

    const now = new Date();
    const startDayIndex = new Date(year, month - 1, 1).getDay();
    const endDayIndex = new Date(year, month, 0).getDay();

    // 평면화된 배열 생성 전 체크
    const flatWeeks = weeks.flatMap((x) => x);
    if (!flatWeeks || flatWeeks.length === 0) {
      console.warn('handleWidgetData: weeks 배열이 비어 있음');
      return undefined;
    }

    const todayDayType = flatWeeks.find((x) => x && x.date && x.date.getDate() === now.getDate());
    const currentWeek = weeks.find(
      (x) => x && x.some((y) => y && y.date && y.date.getDate() === now.getDate()),
    );

    if (!todayDayType || !currentWeek) {
      console.warn('handleWidgetData: 오늘 날짜 데이터 찾을 수 없음');
      return undefined;
    }

    const widgetData: WidgetData = {
      today: {
        date: dateToWidgetDateType(now),
        shift:
          todayDayType && todayDayType.shift
            ? shiftIdToWidgetShiftData(shiftTypes, todayDayType.shift)
            : null,
        schedules: (todayDayType.schedules || [])
          .map((x) => sheduleToWidgetSheduleData(x))
          .filter((x) => x !== null) as WidgetSchedule[],
        closeSchedule: todayDayType.schedules ? findCloseSchedule(todayDayType.schedules) : null,
      },
      week: {
        period: `${currentWeek[0].date.getMonth() + 1}.${currentWeek[0].date.getDate()} ~ ${
          currentWeek[6].date.getMonth() + 1
        }.${currentWeek[6].date.getDate()}`,
        shiftList: currentWeek.map((x) => ({
          date: dateToWidgetDateType(x.date),
          shift: x.shift ? shiftIdToWidgetShiftData(shiftTypes, x.shift) : null,
          isCurrentMonth: x.date.getMonth() + 1 === month,
        })),
      },
      month: {
        year,
        month,
        startDayIndex,
        endDayIndex,
        calendar: makeMonth(
          flatWeeks.map((x) => ({
            date: dateToWidgetDateType(x.date),
            shift: x.shift ? shiftIdToWidgetShiftData(shiftTypes, x.shift) : null,
            isCurrentMonth: x.date.getMonth() + 1 === month,
          })),
        ),
      },
    };
    return widgetData;
  } catch (error) {
    console.error('handleWidgetData 오류:', error);
    return undefined;
  }
};
