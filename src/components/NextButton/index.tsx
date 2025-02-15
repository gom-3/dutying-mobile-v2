import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type SvgProps } from 'react-native-svg';
import { COLOR } from '@/styles';

interface Props {
  text: string;
  Icon?: React.FC<SvgProps>;
  disabled?: boolean;
  onPress: () => void;
}

const NextButton = ({ text, Icon, disabled, onPress }: Props) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <View style={[styles.container, { backgroundColor: disabled ? COLOR.main3 : COLOR.main1 }]}>
        <Text style={styles.text}>{text}</Text>
        {Icon && <Icon style={{ marginLeft: 10, marginTop: 2 }} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'Apple500',
    fontSize: 16,
  },
});

export default NextButton;
