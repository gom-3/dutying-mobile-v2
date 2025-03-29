import NavigationBar from '@/components/NavigationBar';
import PageViewContainer from '@/components/PageView';
import WardCalendarPage from './Calendar';
import EnterWardPendingPage from './components/EnterWardPending';
import useWardPage from './index.hook';

const WardPage = () => {
  const {
    states: { account },
  } = useWardPage();
  return (
    <PageViewContainer>
      {account.status === 'LINKED' ? <WardCalendarPage /> : <EnterWardPendingPage />}
      <NavigationBar page="ward" />
    </PageViewContainer>
  );
};

export default WardPage;
