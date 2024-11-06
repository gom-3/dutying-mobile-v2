import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { deleteFavoriteFriend, registFavoriteFriend } from '@/api/friend';

const useFavorite = () => {
  const queryClient = useQueryClient();
  const [isCallingAPI, setIsCallingAPI] = useState(false);

  const { mutate: registFavoriteMutate } = useMutation({
    mutationFn: (friendId: number) => registFavoriteFriend(friendId),
    onSuccess: () => {
      setIsCallingAPI(false);
      queryClient.invalidateQueries({ queryKey: ['getFriendsList'] });
      queryClient.refetchQueries({ queryKey: ['getFriendsList'] });
    },
  });
  const { mutate: deleteFavoriteMutate } = useMutation({
    mutationFn: (friendId: number) => deleteFavoriteFriend(friendId),
    onSuccess: () => {
      setIsCallingAPI(false);
      queryClient.invalidateQueries({ queryKey: ['getFriendsList'] });
      queryClient.refetchQueries({ queryKey: ['getFriendsList'] });
    },
  });
  return {
    states: { isCallingAPI },
    actions: { setIsCallingAPI, registFavoriteMutate, deleteFavoriteMutate },
  };
};

export default useFavorite;
