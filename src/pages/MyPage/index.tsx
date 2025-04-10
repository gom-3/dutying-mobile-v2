import { useMutation } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { View, Image, TouchableOpacity, Text, Pressable, TextInput, Alert } from 'react-native';
import OutsidePressHandler from 'react-native-outside-press';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { deleteAccount, editProfile } from '@/api/account';
import { quitWard } from '@/api/ward';
import signupAnimation from '@/assets/animations/signup-animation.json';
import { images } from '@/assets/images/profiles';
import CameraIcon from '@/assets/svgs/camera.svg';
import CheckIcon from '@/assets/svgs/check-white.svg';
import PencilIcon from '@/assets/svgs/edit-profile-pencil.svg';
import RandomIcon from '@/assets/svgs/random.svg';
import PageHeader from '@/components/PageHeader';
import PageViewContainer from '@/components/PageView';
import { useAccountStore } from '@/stores/account';
import { useCaledarDateStore } from '@/stores/calendar';
import { useOnboardingStore } from '@/stores/onboarding';
import { hexToRgba } from '@/utils/color';
import { pickImageFromLibrary } from '@/utils/imagePicker';
import { navigate, navigateToLoginAndResetHistory } from '@/utils/navigate';
import { COLOR, screenHeight, screenWidth } from '@/styles';

const MyPage = () => {
  const [initOnboardingState] = useOnboardingStore((state) => [state.initState]);
  const [account, logoutAccount, setState] = useAccountStore((state) => [
    state.account,
    state.logout,
    state.setState,
  ]);
  const [setCalendarState] = useCaledarDateStore((state) => [state.setState]);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [name, setName] = useState(account.name);
  const [profile, setProfile] = useState(account.profileImgBase64);
  const textRef = useRef<TextInput>(null);

  const { mutate: editProfileMutate, isPending: changeProfileLoading } = useMutation({
    mutationFn: (image: string) => editProfile(name, image, account.accountId),
    onSuccess: (data) => {
      setState('account', data);
      Toast.show({
        type: 'success',
        text1: '프로필 사진이 변경되었어요!',
        visibilityTime: 1000,
      });
    },
  });

  const { mutate: editNameMutate } = useMutation({
    mutationFn: ({
      name,
      profile,
      accountId,
    }: {
      name: string;
      profile: string;
      accountId: number;
    }) => editProfile(name, profile, accountId),
    onSuccess: (data) => {
      setState('account', data);
      Toast.show({
        type: 'success',
        text1: '이름이 변경되었어요!',
        visibilityTime: 1000,
      });
    },
  });

  const { mutate: deleteAccountMutate } = useMutation({
    mutationFn: ({ accountId }: { accountId: number }) => deleteAccount(accountId),
    onSuccess: () => {
      navigateToLoginAndResetHistory();
      setCalendarState('isSideMenuOpen', false);
      Toast.show({
        type: 'success',
        text1: '회원탈퇴가 완료되었습니다.',
        visibilityTime: 3000,
      });
      logoutAccount();
      initOnboardingState();
    },
  });

  const { mutate: quitWardMutate, isPending } = useMutation({
    mutationFn: ({ wardId }: { wardId: number }) => quitWard(wardId),
    onSuccess: () => {
      navigate('Ward');
    },
  });

  const setRandomImage = async () => {
    const randomimage = images[Math.floor(Math.random() * 30)] || profile;
    setProfile(randomimage);
    editProfileMutate(randomimage);
  };

  const setPhotoImage = async () => {
    try {
      const photo = await pickImageFromLibrary();
      if (photo) {
        setProfile(photo);
        editProfileMutate(photo);
      }
    } catch {
      Alert.alert('사진 업로드에 실패했습니다.');
    }
    setIsMenuOpen(false);
  };

  const changeName = () => {
    editNameMutate({ name, profile, accountId: account.accountId });
    setIsNameEditing(false);
  };

  const pressName = () => {
    setIsNameEditing(true);
    textRef.current?.focus();
  };

  useEffect(() => {
    if (isNameEditing && textRef.current) textRef.current.focus();
  }, [isNameEditing, textRef.current]);

  const pressNameOutside = () => {
    setName(account.name);
    setIsNameEditing(false);
  };

  const quit = () => {
    Alert.alert('병동에서 나가겠습니까?', '', [
      {
        text: '네',
        onPress: () => {
          quitWardMutate({ wardId: account.wardId });
          Toast.show({
            type: 'success',
            text1: '병동에서 나갔습니다.',
            visibilityTime: 3000,
          });
        },
      },
      { text: '아니오', onPress: () => {} },
    ]);
  };

  const logout = () => {
    Alert.alert('로그아웃 하시겠습니까?', '', [
      {
        text: '네',
        onPress: () => {
          navigateToLoginAndResetHistory();
          Toast.show({
            type: 'success',
            text1: '로그아웃 되었습니다.',
            visibilityTime: 3000,
          });
          setCalendarState('isSideMenuOpen', false);
          logoutAccount();
        },
      },
      { text: '아니오', onPress: () => {} },
    ]);
  };

  const signout = () => {
    Alert.alert('정말 탈퇴하시겠습니까?', '', [
      {
        text: '네',
        onPress: () => {
          deleteAccountMutate({ accountId: account.accountId });
        },
      },
      { text: '아니오', onPress: () => {} },
    ]);
  };

  return (
    <PageViewContainer style={{ backgroundColor: COLOR.bg }}>
      <SafeAreaView>
        <PageHeader title="내 정보" backgroundColor={COLOR.bg} />
      </SafeAreaView>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ position: 'relative', width: 60, height: 60, alignItems: 'center' }}>
          <Image
            style={{ width: 60, height: 60, borderRadius: 100 }}
            source={{ uri: `data:image/png;base64,${account.profileImgBase64}` }}
          />
          <TouchableOpacity
            onPress={() => {
              setIsMenuOpen(true);
            }}
            activeOpacity={0.7}
            style={{ position: 'absolute', bottom: 0, right: -15 }}
          >
            <PencilIcon />
          </TouchableOpacity>
          <View style={{ width: 300, alignItems: 'center' }}>
            {!isNameEditing ? (
              <Pressable
                onPress={pressName}
                style={{ marginTop: 14, borderBottomColor: COLOR.sub1, borderBottomWidth: 1 }}
              >
                <Text style={{ color: COLOR.sub1, fontFamily: 'Apple500', fontSize: 24 }}>
                  {account.name}
                </Text>
              </Pressable>
            ) : (
              <OutsidePressHandler
                disabled={false}
                onOutsidePress={pressNameOutside}
                style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center' }}
              >
                <View style={{ width: 24 }} />
                <TextInput
                  ref={textRef}
                  value={name}
                  onChangeText={(text) => setName(text)}
                  style={{
                    paddingVertical: 2,
                    paddingHorizontal: 8,
                    borderRadius: 5,
                    backgroundColor: COLOR.main4,
                    borderWidth: 1,
                    borderColor: COLOR.main2,
                    fontFamily: 'Apple500',
                    fontSize: 24,
                    color: COLOR.sub1,
                  }}
                />
                <Pressable
                  onPress={changeName}
                  style={{
                    marginLeft: 4,
                    width: 24,
                    height: 24,
                    backgroundColor: COLOR.main2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4.167,
                  }}
                >
                  <CheckIcon />
                </Pressable>
              </OutsidePressHandler>
            )}
          </View>
          {isMenuOpen && (
            <OutsidePressHandler
              style={{
                position: 'absolute',
                width: 130,
                bottom: -90,
                right: -110,
                zIndex: 5,
                backgroundColor: 'white',
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: COLOR.sub4,
              }}
              disabled={false}
              onOutsidePress={() => setIsMenuOpen(false)}
            >
              <TouchableOpacity
                onPress={setRandomImage}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  justifyContent: 'center',
                }}
              >
                <RandomIcon style={{ marginRight: 7 }} />
                <Text style={{ fontSize: 16, fontFamily: 'Apple500', color: COLOR.sub2 }}>
                  랜덤 변경
                </Text>
              </TouchableOpacity>
              <View style={{ height: 0.5, backgroundColor: COLOR.sub4 }} />
              <TouchableOpacity
                onPress={setPhotoImage}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  justifyContent: 'center',
                }}
              >
                <CameraIcon style={{ marginRight: 7 }} />
                <Text
                  style={{ marginLeft: 0, fontSize: 16, fontFamily: 'Apple500', color: COLOR.sub2 }}
                >
                  사진 등록
                </Text>
              </TouchableOpacity>
            </OutsidePressHandler>
          )}
        </View>
      </View>
      <View style={{ height: 3, backgroundColor: COLOR.sub5, marginTop: 90 }} />
      <View style={{ height: screenHeight, backgroundColor: 'white' }}>
        <View style={{ height: 26 }} />
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('http://ye620.channel.io');
          }}
          style={{ paddingHorizontal: 24, paddingVertical: 16 }}
        >
          <Text style={{ fontSize: 16, fontFamily: 'Apple', color: COLOR.sub1 }}>고객센터</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
          <Text style={{ fontSize: 16, fontFamily: 'Apple', color: COLOR.sub1 }}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={signout} style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
          <Text style={{ fontSize: 16, fontFamily: 'Apple', color: COLOR.sub1 }}>회원탈퇴</Text>
        </TouchableOpacity>
        {account.wardId > 0 && (
          <TouchableOpacity onPress={quit} style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
            <Text style={{ fontSize: 16, fontFamily: 'Apple', color: COLOR.sub1 }}>병동탈퇴</Text>
          </TouchableOpacity>
        )}
      </View>
      {(changeProfileLoading || isPending) && (
        <View
          style={{
            position: 'absolute',
            width: screenWidth,
            height: screenHeight,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: hexToRgba('#000000', 0.3),
            left: 0,
            top: 0,
          }}
        >
          <LottieView style={{ width: 200, height: 200 }} source={signupAnimation} autoPlay loop />
        </View>
      )}
    </PageViewContainer>
  );
};

export default MyPage;
