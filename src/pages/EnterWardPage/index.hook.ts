import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { getNurse } from '@/api/nurse';
import { useAccountStore } from '@/stores/account';
import { useEnterWardPageStore } from './store';

const useEnterWardPage = () => {
  const [step, isLoading, setState] = useEnterWardPageStore((state) => [
    state.step,
    state.isLoading,
    state.setState,
  ]);
  const { account } = useAccountStore();
  const navigation = useNavigation();

  const onPressBack = () => {
    if (step > 1) setState('step', step - 1);
    else navigation.goBack();
  };

  const loadNurseInfo = async () => {
    if (account.nurseId) {
      setState('isLoading', true);
      const nurse = await getNurse(account.nurseId);
      setState('name', nurse.name);
      setState('phoneNum', nurse.phoneNum);
      setState('gender', nurse.gender);
      setState('step', 4);
      setState('isLoading', false);
    }
  };

  useEffect(() => {
    loadNurseInfo();
  }, []);

  return { states: { step, isLoading }, actions: { onPressBack } };
};

export default useEnterWardPage;
