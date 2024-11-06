import { useFonts } from 'expo-font';

export default function useInitializeApp() {
  const [assetsLoaded, loadAssetError] = useFonts({
    Apple: require('../assets/fonts/AppleSDGothicNeoR.ttf'),
    Apple500: require('../assets/fonts/AppleSDGothicNeoM.ttf'),
    Apple600: require('../assets/fonts/AppleSDGothicNeoB.ttf'),
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    Poppins500: require('../assets/fonts/Poppins-Medium.ttf'),
    Poppins600: require('../assets/fonts/Poppins-Bold.ttf'),
    Line300: require('../assets/fonts/LINESeedKR-Th.ttf'),
    Line: require('../assets/fonts/LINESeedKR-Rg.ttf'),
    Line500: require('../assets/fonts/LINESeedKR-Bd.ttf'),
  });

  // @TODO 추후 GA, Sentry 등 초기화 로직 추가
  const loaded = assetsLoaded;
  const error = loadAssetError;

  return [loaded, error];
}
