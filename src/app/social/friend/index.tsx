import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FreindIcon from '@/assets/svgs/add-friend.svg';
import ArrowLeftIcon from '@/assets/svgs/arrow-left.svg';
import ArrowRightIcon from '@/assets/svgs/arrow-right.svg';
import MailIcon from '@/assets/svgs/mail.svg';
import RightArrowIcon from '@/assets/svgs/right-arrow-gray.svg';
import UglyCircleIcon from '@/assets/svgs/ugly-circle.svg';
import UglySquareIcon from '@/assets/svgs/ugly-square.svg';
import { AlertModalInvite } from '@/components/AlertModal';
import LottieLoading from '@/components/LottieLoading';
import NavigationBar from '@/components/NavigationBar';
import PageViewContainer from '@/components/PageView';
import CollectionContoller from '@/pages/Social/Friend/components/CollectionController';
import CollectionTable from '@/pages/Social/Friend/components/CollectionTable';
import FriendsList from '@/pages/Social/Friend/components/FriendsList';
import SelectedFriends from '@/pages/Social/Friend/components/SelectedFriends';
import TodayShift from '@/pages/Social/Friend/components/Today';
import useFriendPage from '@/pages/Social/Friend/index.hook';
import { COLOR } from '@/styles';

const weekEnum = ['첫째 주', '둘째 주', '셋째 주', '넷째 주', '다섯째 주', '여섯째 주'];

const NoFriendToday = () => {
  return (
    <View style={{ paddingHorizontal: 26, paddingBottom: 16 }}>
      <UglySquareIcon />
      <Text style={{ color: COLOR.sub2, fontSize: 12, fontFamily: 'Apple', marginTop: 5 }}>
        아직 등록된 친구가 없어요.
      </Text>
    </View>
  );
};

const NoFriendList = () => {
  const router = useRouter();

  return (
    <View style={{ alignItems: 'center', padding: 20 }}>
      <UglyCircleIcon />
      <Text style={{ color: COLOR.sub25, fontSize: 14, fontFamily: 'Apple500', marginTop: 16 }}>
        아직 등록된 친구가 없습니다.
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/request-friend')}
        style={{
          marginTop: 12,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 30,
          paddingHorizontal: 30,
          paddingVertical: 4,
          borderWidth: 1,
          borderColor: COLOR.sub3,
        }}
      >
        <Text style={{ fontSize: 16, fontFamily: 'Apple500', color: COLOR.sub3 }}>
          친구 추가하러 가기
        </Text>
        <RightArrowIcon />
      </TouchableOpacity>
    </View>
  );
};

export default function FriendsPage() {
  const router = useRouter();
  const {
    states: {
      friends,
      favoriteFriends,
      account,
      isIniviteModalOpen,
      date,
      currentWeek,
      isBottomSheetOpen,
      isLoading,
    },
    actions: { pressBackdrop, setIsInviteModalOpen, setState, pressInvite, pressAddFriend },
  } = useFriendPage();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop onPress={pressBackdrop} {...props} />,
    [],
  );

  // Expo Router 스타일로 네비게이션 함수 조정
  const handleNavigateMoimPage = () => {
    router.push('/social/moim');
  };

  return (
    <PageViewContainer style={{ backgroundColor: COLOR.bg }}>
      <BottomSheetModalProvider>
        <AlertModalInvite
          text="내 코드 공유하기"
          subText="아래 코드를 입력하면 나와 친구를 맺을 수 있어요!"
          code={account.code || ''}
          close={() => setIsInviteModalOpen(false)}
          isOpen={isIniviteModalOpen}
        />
        <SafeAreaView>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable onPress={handleNavigateMoimPage}>
                <Text style={styles.headerText}>모임</Text>
              </Pressable>
              <Pressable>
                <Text
                  style={[
                    styles.headerText,
                    {
                      color: COLOR.main1,
                      fontFamily: 'Apple600',
                      marginLeft: 18,
                      textDecorationLine: 'underline',
                    },
                  ]}
                >
                  친구
                </Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={pressInvite}
                style={[
                  styles.headerIcon,
                  {
                    marginRight: 15,
                  },
                ]}
              >
                <MailIcon />
                <Text style={styles.headerIconText}>코드 공유</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={pressAddFriend} style={styles.headerIcon}>
                <FreindIcon />
                <Text style={styles.headerIconText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginLeft: 24, marginBottom: 16, marginTop: 18 }}>
            <View>
              <Text style={styles.sectionTitle}>오늘의 근무</Text>
              <Text style={styles.sectionDesc}>친구들의 근무는 무엇일까요?</Text>
            </View>
          </View>
          {friends && friends.length > 0 ? <TodayShift /> : <NoFriendToday />}
          <View style={{ height: 1, backgroundColor: '#e7e7ef', marginVertical: 16 }} />
          <View
            style={{
              marginHorizontal: 24,
              marginBottom: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <FriendsList friends={friends} />
            <CollectionContoller backdrop={renderBackdrop} friends={friends} />
          </View>
          {favoriteFriends && favoriteFriends?.length > 0 && (
            <SelectedFriends favoriteFriends={favoriteFriends} />
          )}
          {friends && friends.length > 0 ? (
            <View>
              <View style={styles.weekNumber}>
                <Text style={styles.weekNumberText}>
                  {`${date.getMonth() + 1}월 `}
                  {weekEnum[currentWeek]}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setState(
                      'date',
                      new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7),
                    )
                  }
                >
                  <ArrowLeftIcon width={40} height={40} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setState(
                      'date',
                      new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7),
                    )
                  }
                >
                  <ArrowRightIcon width={40} height={40} />
                </TouchableOpacity>
              </View>
              <CollectionTable />
            </View>
          ) : (
            <View style={{ marginTop: 50 }}>
              <NoFriendList />
            </View>
          )}
        </SafeAreaView>
      </BottomSheetModalProvider>
      {!isBottomSheetOpen && <NavigationBar page="social" />}
      {isLoading && <LottieLoading />}
    </PageViewContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    color: COLOR.sub3,
    fontFamily: 'Apple500',
  },
  headerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  headerIconText: { fontSize: 12, fontFamily: 'Apple500', color: COLOR.main2 },
  sectionTitle: {
    color: COLOR.sub1,
    fontFamily: 'Apple600',
    fontSize: 16,
  },
  sectionDesc: {
    marginTop: 4,
    color: COLOR.sub3,
    fontFamily: 'Apple',
    fontSize: 10,
  },
  weekNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 16,
  },
  weekNumberText: {
    color: COLOR.main1,
    fontSize: 14,
    fontFamily: 'Apple500',
  },
});
