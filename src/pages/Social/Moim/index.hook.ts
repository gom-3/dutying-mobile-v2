import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { useLinkTo } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import Toast from 'react-native-toast-message';
import { createMoim, getMoimList } from '@/api/moim';
import { useAccountStore } from '@/stores/account';
import { firebaseLogEvent } from '@/utils/event';
import { useMoimStore } from './store';

const useMoimPage = () => {
  const [accountId] = useAccountStore((state) => [state.account.accountId]);
  const linkTo = useLinkTo();
  const navigateMoimEnter = () => linkTo('MoimEnter');
  const navigateFriendsPage = () => linkTo('Friends');
  const moimNameRef = useRef<string>('');
  const queryClient = useQueryClient();
  const [isValid, setIsValid] = useState(true);
  const createRef = useRef<BottomSheetModal>(null);
  const [setMoimState] = useMoimStore((state) => [state.setState]);

  const { mutate: createMoimMutate, isPending: createLoading } = useMutation({
    mutationFn: (name: string) => createMoim(name),
    onSuccess: () => {
      firebaseLogEvent('make_moim');
      queryClient.invalidateQueries({ queryKey: ['getMoimList', accountId] });
      queryClient.refetchQueries({ queryKey: ['getMoimList', accountId] });
      closeBottomSheet();
      Toast.show({
        type: 'success',
        text1: '모임이 생성되었어요!',
        text2: '코드를 공유해 사람들을 초대할 수 있어요👋',
        visibilityTime: 3000,
      });
    },
    onError: () => {
      setIsValid(false);
    },
  });

  const closeBottomSheet = () => {
    createRef.current?.close();
    moimNameRef.current = '';
  };

  const pressCheck = () => {
    createMoimMutate(moimNameRef.current);
  };

  const {
    data: moimList,
    isLoading,
    isRefetching,
  } = useQuery({ queryKey: ['getMoimList', accountId], queryFn: () => getMoimList() });

  const pressEnterMoim = () => {
    firebaseLogEvent('enter_moim');
    navigateMoimEnter();
  };

  const pressMoimCard = (moimId: number, moimCode: string) => {
    setMoimState('moimId', moimId);
    setMoimState('moimCode', moimCode);
    linkTo('MoimDetail');
  };

  return {
    states: { createLoading, isValid, createRef, moimList, moimNameRef, isLoading, isRefetching },

    actions: {
      setIsValid,
      pressMoimCard,
      pressCheck,
      navigateMoimEnter,
      closeBottomSheet,
      navigateFriendsPage,
      pressEnterMoim,
    },
  };
};

export default useMoimPage;
