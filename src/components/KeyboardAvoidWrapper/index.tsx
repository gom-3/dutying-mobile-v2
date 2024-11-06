import { type ReactNode, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { screenHeight, screenWidth } from '@/styles';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const KeyboardAvoidWrapper = ({ children, style }: Props) => {
  const ref = useRef<ScrollView | null>(null);
  if (Platform.OS === 'android')
    return (
      <KeyboardAvoidingView behavior="height">
        <ScrollView style={[styles.container, style]} ref={ref} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  else
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={50}
        resetScrollToCoords={{ x: 0, y: 0 }}
        style={[styles.container, style]}
      >
        {children}
      </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: screenHeight,
    width: screenWidth,
  },
});

export default KeyboardAvoidWrapper;
