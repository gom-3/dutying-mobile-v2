import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getAccount } from '@/api/account';
import { useAccountStore } from '@/stores/account';
import { useOnboardingStore } from '@/stores/onboarding';
import { navigate } from '@/utils/navigate';

const useWardPage = () => {
  const [account, setState] = useAccountStore((state) => [state.account, state.setState]);
  const [isDoneOnboarding] = useOnboardingStore((state) => [state.ward]);
  const { data: accountData } = useQuery({
    queryKey: ['getMyAccount'],
    queryFn: () => getAccount(),
  });

  useEffect(() => {
    if (accountData) {
      setState('account', accountData);
    }
    if (accountData?.status === 'LINKED' && !isDoneOnboarding) {
      navigate('WardOnboarding');
    }
  }, [accountData, isDoneOnboarding]);

  return {
    states: { account },
    actions: {},
  };
};

export default useWardPage;
