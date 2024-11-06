import { Redirect } from 'expo-router';
import { match } from 'ts-pattern';
import { ACCOUNT_ROLE } from '@/constants';
import useAccount from '@/hooks/useAccount';

export default () => {
  const { account } = useAccount();

  return match(account?.role)
    .with(ACCOUNT_ROLE.PATIENT, () => <Redirect href="/patient" />)
    .with(ACCOUNT_ROLE.CAREGIVER, () => <Redirect href="/caregiver" />)
    .with(null, () => <Redirect href="/signup" />)
    .otherwise(() => <Redirect href="/login" />);
};
