import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type SearchMoimFromCodeResponseDTO, searchMoimCode } from '@/api/moim';
import RightArrowIcon from '@/assets/svgs/right-arrow-white.svg';
import { AlertModalEnter } from '@/components/AlertModal';
import PageHeader from '@/components/PageHeader';
import PageViewContainer from '@/components/PageView';
import { useAccountStore } from '@/stores/account';
import { hexToRgba } from '@/utils/color';
import { COLOR } from '@/styles';

const MoimEnterPage = () => {
  const [enteredInput, setEnteredInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [account] = useAccountStore((state) => [state.account]);
  const [moim, setMoim] = useState<SearchMoimFromCodeResponseDTO>();
  const [isValid, setIsValid] = useState(true);
  const mainRef = useRef<TextInput>(null);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (mainRef.current) mainRef.current.focus();
  }, []);

  const { mutate: searchMoimMutate } = useMutation({
    mutationFn: (enteredInput: string) => searchMoimCode(enteredInput),
    onSuccess: (data) => {
      setMoim(data);
      setIsModalOpen(true);
      mainRef.current?.blur();
    },
    onError: () => {
      setIsValid(false);
    },
  });

  const pressEnterButton = () => {
    if (enteredInput.length !== 6) {
      setIsValid(false);
    } else {
      searchMoimMutate(enteredInput);
    }
  };

  const changeMainTextInput = (text: string) => {
    if (text.length <= 6) {
      setEnteredInput(text);
      setIsValid(true);
    }
  };

  return (
    <PageViewContainer>
      <SafeAreaView>
        {moim && (
          <AlertModalEnter
            isOpen={isModalOpen}
            moim={moim}
            accountId={account.accountId}
            close={closeModal}
          />
        )}
        <PageHeader title="모임 입장" />
        <View style={{ marginTop: 32, marginBottom: 70, marginHorizontal: 32 }}>
          <Text style={{ fontSize: 24, fontFamily: 'Line', color: '#150b3c' }}>
            <Text style={{ textDecorationLine: 'underline' }}>모임 초대 코드</Text>를
          </Text>
          <Text style={{ fontSize: 24, fontFamily: 'Line', color: '#150b3c' }}>입력해주세요</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TextInput
            ref={mainRef}
            style={{
              position: 'absolute',
              opacity: 0,
              zIndex: 20,
              width: '100%',
              height: '100%',
              fontSize: 1,
              textAlign: 'center',
            }}
            value={enteredInput}
            onChangeText={changeMainTextInput}
          />
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <TextInput
              key={i}
              value={enteredInput[i]}
              maxLength={1}
              onFocus={() => mainRef.current?.focus()}
              style={{
                width: 35,
                height: 50,
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 24,
                fontFamily: 'Apple',
                borderRadius: 5,
                borderWidth: 1,
                margin: 5,
                borderColor: isValid
                  ? enteredInput.length === i || (enteredInput.length === 6 && i === 5)
                    ? COLOR.sub3
                    : COLOR.main4
                  : hexToRgba('#ff4a80', 0.7),
                backgroundColor: COLOR.bg,
              }}
            />
          ))}
        </View>
        {!isValid && (
          <View style={{ height: 22, alignItems: 'center', marginTop: 8 }}>
            <Text style={{ fontSize: 14, fontFamily: 'Apple', color: '#ff4a80' }}>
              올바른 코드가 아닙니다. 다시 한번 확인해주세요.
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={pressEnterButton}
          style={{
            flexDirection: 'row',
            backgroundColor: COLOR.main1,
            marginHorizontal: 32,
            marginVertical: isValid ? 85 : 55,
            padding: 13,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontFamily: 'Apple500',
              marginLeft: 10,
              marginRight: 5,
            }}
          >
            입장
          </Text>
          <RightArrowIcon />
        </TouchableOpacity>
      </SafeAreaView>
    </PageViewContainer>
  );
};

export default MoimEnterPage;
