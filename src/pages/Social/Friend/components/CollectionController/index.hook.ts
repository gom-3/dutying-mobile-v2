import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { useMemo, useRef } from 'react';
import { type Friend } from '@/api/friend';
import useFavorite from '@/hooks/useFavorite';
import { useFriendStore } from '../../store';

const useCollectionController = (friends: Friend[] | undefined) => {
  const {
    states: { isCallingAPI },
    actions: { deleteFavoriteMutate, registFavoriteMutate, setIsCallingAPI },
  } = useFavorite();

  const [setState] = useFriendStore((state) => [state.setState]);
  const friendCollectionRef = useRef<BottomSheetModal>(null);

  const openFriendsCollectionBottomSheet = () => {
    friendCollectionRef.current?.present();
    setState('isBottomSheetOpen', true);
  };

  const favoriteFriends = useMemo(() => {
    return friends?.filter((friend) => friend.isFavorite);
  }, [friends]);

  const pressFavoiteCheckButton = (isFavorite: boolean, friendId: number) => {
    if (isCallingAPI) return;

    setIsCallingAPI(true);
    if (isFavorite) deleteFavoriteMutate(friendId);
    else registFavoriteMutate(friendId);
  };

  return {
    states: { friendCollectionRef, favoriteFriends },
    actions: { pressFavoiteCheckButton, openFriendsCollectionBottomSheet },
  };
};

export default useCollectionController;
