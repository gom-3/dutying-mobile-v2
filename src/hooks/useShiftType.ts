import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getShiftTypes } from '@/api/shiftTypes';
import { useAccountStore } from '@/stores/account';
import { useShiftTypeStore } from '@/stores/shift';
import { type Shift } from '@/types/shift';

const useShiftType = () => {
  const [userId, account] = useAccountStore((state) => [state.account.accountId, state.account]);
  const { data: shiftTypesResponse } = useQuery({
    queryKey: ['getShiftTypes', userId, account.status],
    queryFn: () => getShiftTypes(userId),
    enabled: userId > 0,
  });
  const { setState } = useShiftTypeStore();
  useEffect(() => {
    const shiftTypes = new Map<number, Shift>();
    shiftTypesResponse?.shiftTypes?.filter((type) =>
      shiftTypes.set(type.accountShiftTypeId, {
        ...type,
        startTime: type.startTime ? new Date(`2023-12-31T${type.startTime}:00`) : null,
        endTime: type.endTime ? new Date(`2023-12-31T${type.endTime}:00`) : null,
      }),
    );
    setState('shiftTypes', shiftTypes);
  }, [shiftTypesResponse]);
};

export default useShiftType;
