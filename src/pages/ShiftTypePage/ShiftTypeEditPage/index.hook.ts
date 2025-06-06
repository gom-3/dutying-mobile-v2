import { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  addShiftType,
  deleteShiftType,
  editShiftType,
  type ShiftTypeRequestDTO,
} from '@/api/shiftTypes';
import { useAccountStore } from '@/stores/account';
import { type Shift } from '@/types/shift';
import { firebaseLogEvent } from '@/utils/event';
import { useEditShiftTypeStore, type ShiftWithoutID } from '../store';
interface TypeList {
  text: string;
  key: Shift['classification'];
}

const defaultClassification = ['DAY', 'EVENING', 'NIGHT', 'OFF'];
const workClassification = ['DAY', 'EVENING', 'NIGHT', 'OTHER_WORK'];

const workTypeList: TypeList[] = [
  { text: '데이', key: 'DAY' },
  { text: '이브닝', key: 'EVENING' },
  { text: '나이트', key: 'NIGHT' },
  { text: '그외 근무', key: 'OTHER_WORK' },
];

const offTypeList: TypeList[] = [
  { text: '오프', key: 'OFF' },
  { text: '휴가', key: 'LEAVE' },
];

const useShiftTypeEdit = () => {
  const [userId] = useAccountStore((state) => [state.account.accountId]);
  const [shift, isEdit, accountShiftTypeId, setState] = useEditShiftTypeStore((state) => [
    state.currentShift,
    state.isEdit,
    state.accountShiftTypeId,
    state.setState,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [usingTime, setUsingTime] = useState(shift.startTime ? true : false);
  const [isValid, setIsValid] = useState({ name: true, shortName: true });
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const isWorkTypeShift = workClassification.includes(shift.classification);
  const isDefaultShiftType =
    shift.classification !== 'OTHER_WORK' && shift.classification !== 'OTHER_LEAVE';
  const onSuccessMutate = () => {
    queryClient.invalidateQueries({ queryKey: ['getShiftTypes', userId] });
    queryClient.refetchQueries({ queryKey: ['getShiftTypes', userId] });
    navigation.goBack();
  };

  const { mutate: addShiftTypeMutate } = useMutation({
    mutationFn: (shift: ShiftTypeRequestDTO) => addShiftType(userId, shift),
    onSuccess: () => {
      onSuccessMutate();
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
  const { mutate: editShiftTypeMutate } = useMutation({
    mutationFn: ({ shiftId, shift }: { shiftId: number; shift: ShiftTypeRequestDTO }) =>
      editShiftType(userId, shiftId, shift),
    onSuccess: onSuccessMutate,
    onSettled: () => {
      setIsLoading(false);
    },
  });
  const { mutate: deleteShiftTypeMutate } = useMutation({
    mutationFn: (shiftId: number) => deleteShiftType(userId, shiftId),
    onSuccess: onSuccessMutate,
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const changeStartTime = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const newShift: ShiftWithoutID = { ...shift, startTime: selectedDate! };
    setState('currentShift', newShift);
  };
  const changeEndTime = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const newShift: ShiftWithoutID = { ...shift, endTime: selectedDate! };
    setState('currentShift', newShift);
  };
  const onChangeSwith = (value: boolean) => {
    firebaseLogEvent('change_shift_time');
    if (value) {
      const newShift: ShiftWithoutID = shift.startTime
        ? shift
        : {
            ...shift,
            startTime: new Date('2023-12-31T09:00:00'),
            endTime: new Date('2023-12-31T12:00:00'),
          };
      setState('currentShift', newShift);
      setUsingTime(true);
    } else {
      const newShift: ShiftWithoutID = { ...shift, startTime: null, endTime: null };
      setState('currentShift', newShift);
      setUsingTime(false);
    }
  };
  const onChangeColor = (color: string) => {
    const newShift: ShiftWithoutID = { ...shift, color: color };
    setState('currentShift', newShift);
  };
  const onChangeTextInput = (target: 'name' | 'shortName', value: string) => {
    const newShift: ShiftWithoutID = { ...shift, [target]: value };
    setState('currentShift', newShift);
  };
  const onPressShiftType = (type: Shift['classification']) => {
    firebaseLogEvent('change_shift_classification');
    const newShift: ShiftWithoutID = { ...shift, classification: type };
    if (type === 'OTHER_WORK' || type === 'LEAVE') {
      newShift.startTime = null;
      newShift.endTime = null;
      setUsingTime(false);
    }
    setState('currentShift', newShift);
  };
  const onPressDeleteButton = () => {
    if (isLoading) return;
    setIsLoading(true);
    firebaseLogEvent('delete_shfit_type');
    deleteShiftTypeMutate(accountShiftTypeId);
  };
  const onPressSaveButton = () => {
    if (isLoading) return;
    if (shift.name.length > 0 && shift.shortName.length > 0) {
      setIsLoading(true);
      const startTime = shift.startTime
        ? `${shift.startTime.getHours().toString().padStart(2, '0')}:${shift.startTime
            ?.getMinutes()
            .toString()
            .padStart(2, '0')}`
        : null;
      const endTime = shift.endTime
        ? `${shift.endTime?.getHours().toString().padStart(2, '0')}:${shift.endTime
            .getMinutes()
            .toString()
            .padStart(2, '0')}`
        : null;
      const reqDTO = {
        ...shift,
        startTime,
        endTime,
        isDefault: defaultClassification.includes(shift.classification),
      } as ShiftTypeRequestDTO;
      if (!isEdit) {
        firebaseLogEvent('add_shfit_type');
        addShiftTypeMutate(reqDTO);
      } else {
        firebaseLogEvent('edit_shift_type');
        editShiftTypeMutate({ shiftId: accountShiftTypeId, shift: reqDTO });
      }
    } else {
      if (shift.name.length === 0) {
        setIsValid((prev) => ({ ...prev, name: false }));
      }
      if (shift.shortName.length === 0) {
        setIsValid((prev) => ({ ...prev, shortName: false }));
      }
    }
  };
  return {
    states: {
      shift,
      isEdit,
      isWorkTypeShift,
      usingTime,
      workTypeList,
      offTypeList,
      isValid,
      isDefaultShiftType,
    },
    actions: {
      onChangeSwith,
      changeStartTime,
      changeEndTime,
      onChangeColor,
      onChangeTextInput,
      onPressShiftType,
      onPressSaveButton,
      onPressDeleteButton,
      setIsValid,
    },
  };
};

export default useShiftTypeEdit;
