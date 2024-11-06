import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { type Friend, deleteFriend } from '@/api/friend';
import { useAccountStore } from '@/stores/account';
import { useCaledarDateStore } from '@/stores/calendar';
import { useFriendStore } from '../../store';

const useFriendsList = () => {
  const [setFriendState] = useFriendStore((state) => [state.setState]);
  const [date] = useCaledarDateStore((state) => [state.date]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentFriend, setCurrentFriend] = useState<Friend>();
  const [account] = useAccountStore((state) => [state.account]);
  const queryClient = useQueryClient();
  const friendListRef = useRef<BottomSheetModal>(null);

  const year = date.getFullYear();
  const month = date.getMonth();

  const { mutate: deleteFriendMutate } = useMutation({
    mutationFn: ({ frinedId }: { frinedId: number }) => deleteFriend(frinedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getFriendsList'] });
      queryClient.refetchQueries({ queryKey: ['getFriendsList'] });
      queryClient.invalidateQueries({ queryKey: ['getFriendTodayShift'] });
      queryClient.refetchQueries({ queryKey: ['getFriendTodayShift'] });
    },
  });

  const pressBackdrop = () => {
    setFriendState('isBottomSheetOpen', false);
    queryClient.invalidateQueries({ queryKey: ['getFriendCollection', year, month] });
    queryClient.refetchQueries({ queryKey: ['getFriendCollection', year, month] });
  };

  const openDeleteModal = () => {
    friendListRef.current?.close();
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    friendListRef.current?.present();
  };
  const openFriendsListBottomSheet = () => {
    friendListRef.current?.present();
    setFriendState('isBottomSheetOpen', true);
  };
  const acceptDeleteFriend = async () => {
    if (currentFriend) {
      deleteFriendMutate({ frinedId: currentFriend.accountId });
      closeDeleteModal();
    }
  };
  const pressDeleteButton = (friend: Friend) => {
    setCurrentFriend(friend);
    openDeleteModal();
  };

  return {
    states: { currentFriend, account, isDeleteModalOpen, friendListRef },
    actions: {
      pressBackdrop,
      closeDeleteModal,
      acceptDeleteFriend,
      pressDeleteButton,
      openFriendsListBottomSheet,
    },
  };
};

export default useFriendsList;
