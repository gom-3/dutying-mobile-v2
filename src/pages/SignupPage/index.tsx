import LottieView from 'lottie-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import signupAnimation from '@/assets/animations/signup-animation.json';
import BackArrowIcon from '@/assets/svgs/back-arrow.svg';
import PageViewContainer from '@/components/PageView';
import { hexToRgba } from '@/utils/color';
import { COLOR, screenHeight, screenWidth } from '@/styles';
import Name from './components/Name';
import Profile from './components/Profile';
import useSignupPage from './index.hook';

const SignupPage = () => {
  const {
    states: { step, isLoading },
    actions: { onPressBack },
  } = useSignupPage();

  return (
    <PageViewContainer withoutLogin>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={onPressBack}>
          <BackArrowIcon />
        </TouchableOpacity>
        <View style={styles.steps}>
          {[1, 2].map((item) => (
            <View
              key={item}
              style={[styles.step, { backgroundColor: step === item ? COLOR.main1 : COLOR.sub4 }]}
            >
              <Text style={styles.stepText}>{item}</Text>
            </View>
          ))}
        </View>
        {step === 1 && <Name />}
        {step === 2 && <Profile />}
      </SafeAreaView>
      {isLoading && (
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

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  steps: {
    flexDirection: 'row',
    marginTop: 24,
  },
  step: {
    width: 26,
    height: 26,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  stepText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    height: 23,
    color: 'white',
  },
});

export default SignupPage;
