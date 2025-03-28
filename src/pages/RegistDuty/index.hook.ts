import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import {
  type AccountShiftListRequestDTO,
  type AccountShiftRequest,
  editAccountShiftList,
  getAccountShiftList,
} from '@/api/shift';
import { type TDateData } from '@/pages/HomePage/components/Calendar';
import { useEditShiftTypeStore } from '@/pages/ShiftTypePage/store';
import { useAccountStore } from '@/stores/account';
import { useCaledarDateStore } from '@/stores/calendar';
import { useOnboardingStore } from '@/stores/onboarding';
import { useShiftTypeStore } from '@/stores/shift';
import { type Shift } from '@/types/shift';
import { isSameDate } from '@/utils/date';
import { firebaseLogEvent } from '@/utils/event';
import { navigate } from '@/utils/navigate';

const useRegistDuty = () => {
  const [date, calendar, setState] = useCaledarDateStore((state) => [
    state.date,
    state.calendar,
    state.setState,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useAccountStore((state) => [state.account.accountId]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [setOnboardingState] = useOnboardingStore((state) => [state.setState]);
  const [tempCalendar, setTempCalendar] = useState<TDateData[]>(calendar);
  const [editShift] = useEditShiftTypeStore((state) => [state.editShift]);

  const navigateToEidtShiftType = () => navigate('ShiftTypeEdit');
  const navigateToShiftType = () => navigate('ShiftType');

  const year = date.getFullYear();
  const month = date.getMonth();
  const [index, setIndex] = useState(date.getDate() + new Date(year, month, 1).getDay() - 1);
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const shiftTypeButtons = useMemo(() => {
    const array: (Shift | null)[] = Array.from(shiftTypes.values());
    const result: (Shift | null)[][] = [];

    for (let i = 0; i < array.length; i += 4) {
      let chunk = array.slice(i, i + 4);
      if (chunk.length < 4)
        chunk = chunk.concat(Array.from({ length: 4 - chunk.length }, () => null));
      result.push(chunk);
    }
    return result;
  }, []);

  const { mutate: editAccountShiftListMutate } = useMutation({
    mutationFn: (shiftList: AccountShiftListRequestDTO) => editAccountShiftList(userId, shiftList),
    onSuccess: () => {
      setState('isSideMenuOpen', false);
      setState('calendar', [...tempCalendar]);
      setOnboardingState('registDone', true);
      navigation.goBack();
      queryClient.invalidateQueries({
        queryKey: ['getAccountShiftList', userId, date.getFullYear(), date.getMonth()],
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const getAccountShiftListKey = [
    'getAccountShiftList',
    userId,
    date.getFullYear(),
    date.getMonth(),
  ];

  const { data: shiftListResponse } = useQuery({
    queryKey: getAccountShiftListKey,
    queryFn: () => getAccountShiftList(userId, date.getFullYear(), date.getMonth()),
  });

  const longPressShift = (shift: Shift) => {
    const { accountShiftTypeId, ...shiftWithoutId } = shift;
    editShift(shiftWithoutId, accountShiftTypeId);
    navigateToEidtShiftType();
  };

  const registCalendar = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const calendar: TDateData[] = [];
    let dateIndex = 0;
    if (shiftListResponse) {
      const shiftList = shiftListResponse.accountShiftTypeIdList;
      for (let i = first.getDay() - 1; i >= 0; i--) {
        const date: TDateData = {
          date: new Date(year, month, -i),
          shift: shiftList[dateIndex++],
          schedules: [],
        };
        calendar.push(date);
      }
      for (let i = 1; i <= last.getDate(); i++) {
        const date: TDateData = {
          date: new Date(year, month, i),
          shift: shiftList[dateIndex++],
          schedules: [],
        };
        calendar.push(date);
      }
      for (let i = last.getDay(), j = 1; i < 6; i++, j++) {
        const date: TDateData = {
          date: new Date(year, month + 1, j),
          shift: shiftList[dateIndex++],
          schedules: [],
        };
        calendar.push(date);
      }
    }
    return calendar;
  }, [shiftListResponse]);

  const selectedDate = tempCalendar[index] && tempCalendar[index].date;

  const weeks = useMemo(() => {
    const weeks = [];
    const temp = [...tempCalendar];
    while (temp.length > 0) weeks.push(temp.splice(0, 7));
    return weeks;
  }, [tempCalendar]);

  const shiftTypesCount = useMemo(() => {
    const map = new Map<number, number>();
    tempCalendar.forEach((date) => {
      if (date.shift) {
        const value = map.get(date.shift) || 0;
        map.set(date.shift, value + 1);
      }
    });
    return map;
  }, [tempCalendar]);

  const insertShift = (shift: number) => {
    firebaseLogEvent('insert_shift');
    const newValue: TDateData = {
      ...tempCalendar[index],
      shift,
    };
    const newArray = [...tempCalendar];
    newArray[index] = newValue;
    setTempCalendar(newArray);
    if (
      tempCalendar[index + 1] &&
      tempCalendar[index + 1].date.getMonth() === tempCalendar[index].date.getMonth()
    ) {
      setIndex(index + 1);
    }
  };

  const deleteShift = () => {
    firebaseLogEvent('delete_shift');
    const newValue: TDateData = {
      ...tempCalendar[index],
      shift: null,
    };
    const newArray = [...tempCalendar];
    newArray[index] = newValue;
    setTempCalendar(newArray);
    if (
      tempCalendar[index - 1] &&
      tempCalendar[index - 1].date.getMonth() === tempCalendar[index].date.getMonth()
    ) {
      setIndex(index - 1);
    }
  };

  const selectDate = (e: Date) => {
    if (e.getMonth() === date.getMonth()) {
      setIndex(tempCalendar.findIndex((t) => isSameDate(t.date, e)));
    }
  };

  const saveRegistDutyChange = () => {
    if (isLoading) return;
    setIsLoading(true);
    firebaseLogEvent('regist_shift');
    const accountShiftList: AccountShiftRequest[] = [];

    tempCalendar.forEach((date) => {
      const dateObj = date.date;
      accountShiftList.push({
        shiftDate: `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`,
        accountShiftTypeId: date.shift,
      });
    });
    const requestDTO: AccountShiftListRequestDTO = { accountShifts: accountShiftList };
    editAccountShiftListMutate(requestDTO);
  };

  useEffect(() => {
    setTempCalendar(registCalendar);
  }, [registCalendar]);

  return {
    state: {
      date,
      weeks,
      selectedDate,
      shiftTypes,
      shiftTypesCount,
      shiftTypeButtons,
      isLoading,
    },
    actions: {
      insertShift,
      deleteShift,
      selectDate,
      saveRegistDutyChange,
      navigateToShiftType,
      longPressShift,
    },
  };
};

export default useRegistDuty;
