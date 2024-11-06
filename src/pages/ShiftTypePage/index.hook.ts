import { useLinkProps } from '@react-navigation/native';
import { useMemo } from 'react';
import useShiftType from '@/hooks/useShiftType';
import { useShiftTypeStore } from '@/stores/shift';
import { type Shift } from '@/types/shift';
import { firebaseLogEvent } from '@/utils/event';
import { useEditShiftTypeStore } from './store';

const workClassifications = ['DAY', 'EVENING', 'NIGHT', 'OTHER_WORK'];
const offClassification = ['OFF', 'LEAVE', 'OTHER_LEAVE'];

const useShiftTypePage = () => {
  const { initShift, editShift } = useEditShiftTypeStore();
  const [shiftTypes] = useShiftTypeStore((state) => [state.shiftTypes]);
  const { onPress: navigateToEdit } = useLinkProps({ to: { screen: 'ShiftTypeEdit' } });
  useShiftType();
  const workShiftTypes = useMemo(
    () =>
      Array.from(shiftTypes.size > 0 ? shiftTypes.values() : []).filter((shiftType) =>
        workClassifications.includes(shiftType.classification),
      ),
    [shiftTypes],
  );
  const offShiftTypes = useMemo(
    () =>
      Array.from(shiftTypes.size > 0 ? shiftTypes.values() : []).filter((shiftType) =>
        offClassification.includes(shiftType.classification),
      ),
    [shiftTypes],
  );

  const onPressPlusIcon = () => {
    firebaseLogEvent('move_add_shift_type');
    initShift();
    navigateToEdit();
  };

  const onPressEditIcon = (shift: Shift) => {
    firebaseLogEvent('move_edit_shift_type');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { accountShiftTypeId, ...shiftWithoutAccountShiftTypeId } = shift;
    editShift(shiftWithoutAccountShiftTypeId, shift.accountShiftTypeId);
    navigateToEdit();
  };

  return {
    states: { workShiftTypes, offShiftTypes },
    actions: { onPressPlusIcon, onPressEditIcon },
  };
};

export default useShiftTypePage;
