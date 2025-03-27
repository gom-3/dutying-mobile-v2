import LottieView from 'lottie-react-native';
import { View } from 'react-native';
import signupAnimation from '@/assets/animations/signup-animation.json';
import { hexToRgba } from '@/utils/color';
import { screenHeight, screenWidth } from '@/styles';

const LottieLoading = () => {
  return (
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
  );
};

export default LottieLoading;
