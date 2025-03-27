import React from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { COLOR } from '@/styles';

const TextInputBox: React.FC<TextInputProps> = (props) => {
  return <TextInput {...props} style={[styles.input, props.style]} />;
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: COLOR.main4,
    width: 124,
    fontSize: 20,
    fontFamily: 'Apple',
    color: COLOR.sub1,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
});

export default TextInputBox;
