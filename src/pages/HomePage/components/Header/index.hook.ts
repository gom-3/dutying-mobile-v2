import { useEffect, useState } from 'react';
import { useCaledarDateStore } from '@/stores/calendar';
import { useShiftTypeStore } from '@/stores/shift';
import { firebaseLogEvent } from '@/utils/event';
import { navigate } from '@/utils/navigate';

const useCalendarHeader = () => {
  const [calendar, setState] = useCaledarDateStore((state) => [state.calendar, state.setState]);
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const [shiftTypesCount, setShiftTypesCount] = useState(new Map<number, number>());

  const navigateToNotification = () => {
    firebaseLogEvent('move_notification');
    navigate('Notification');
  };

  const openSideMenu = () => {
    firebaseLogEvent('open_sidemenu');
    setState('isSideMenuOpen', true);
  };

  useEffect(() => {
    if (calendar) {
      const map = new Map<number, number>();
      let isCurrentMonth = false;
      calendar.forEach((date) => {
        if (date.date.getDate() === 1) {
          isCurrentMonth = !isCurrentMonth;
        }
        if (date.shift && isCurrentMonth) {
          const value = map.get(date.shift) || 0;
          map.set(date.shift, value + 1);
        }
      });
      setShiftTypesCount(map);
    }
  }, [calendar]);

  return {
    states: { shiftTypes, shiftTypesCount },
    actions: { navigateToNotification, openSideMenu },
  };
};

export default useCalendarHeader;
