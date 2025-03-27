import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationBar from '@/components/NavigationBar';
import { COLOR } from '@/styles';

export default function SocialIndexPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.bg }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontFamily: 'Apple600', marginBottom: 20 }}>소셜</Text>

        <TouchableOpacity
          style={{
            padding: 15,
            backgroundColor: COLOR.main1,
            borderRadius: 8,
            marginBottom: 15,
          }}
          onPress={() => router.push('/social/friend')}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Apple500' }}>친구</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: 15,
            backgroundColor: COLOR.main1,
            borderRadius: 8,
          }}
          onPress={() => router.push('/social/moim')}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Apple500' }}>모임</Text>
        </TouchableOpacity>
      </View>
      <NavigationBar page="social" />
    </SafeAreaView>
  );
}
