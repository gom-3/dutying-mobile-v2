import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getFriendCollection } from '@/api/friend';
import { useCaledarDateStore } from '@/stores/calendar';
import { getCurrentWeekIndex } from '@/utils/date';
import { useFriendStore } from '../../store';

const useCollectionTable = () => {
  const [date] = useCaledarDateStore((state) => [state.date, state.setState]);
  const [weeks] = useFriendStore((state) => [state.weeks]);

  const year = date.getFullYear();
  const month = date.getMonth();
  const currentWeek = getCurrentWeekIndex(date, weeks);

  const { data: collection, isFetching } = useQuery({
    queryKey: ['getFriendCollection', year, month],
    queryFn: () => getFriendCollection(year, month),
  });

  const sortedCollection = useMemo(() => {
    if (isFetching) return undefined;
    return collection?.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
  }, [isFetching, collection]);

  const week = useMemo(() => {
    return weeks.filter((_, i) => i === currentWeek)[0];
  }, [date, weeks]);

  return { states: { week, currentWeek, sortedCollection, isFetching } };
};

export default useCollectionTable;
