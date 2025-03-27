import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLOR } from '@/styles';

export default function RequestFriendPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.bg }}>
      <View style={styles.container}>
        <Text style={styles.title}>친구 추가하기</Text>
        <Text style={styles.description}>
          친구의 초대 코드를 입력하여 친구를 추가할 수 있습니다.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="친구 초대 코드를 입력하세요"
          placeholderTextColor={COLOR.sub3}
        />

        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>친구 추가</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Apple600',
    color: COLOR.sub1,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Apple',
    color: COLOR.sub2,
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.sub4,
    marginBottom: 20,
    fontFamily: 'Apple',
  },
  button: {
    backgroundColor: COLOR.main1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Apple500',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLOR.sub2,
    fontFamily: 'Apple500',
    fontSize: 16,
  },
});
