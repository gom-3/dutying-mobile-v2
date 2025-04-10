import { TouchableOpacity, View, Text } from 'react-native';
import { type Friend } from '@/api/friend';
import ExitIcon from '@/assets/svgs/exit-purple.svg';
import { COLOR } from '@/styles';
import useSelectedFriends from './index.hook';

interface Props {
  favoriteFriends: Friend[];
}

const SelectedFriends = ({ favoriteFriends }: Props) => {
  const {
    actions: { pressDeleteName },
  } = useSelectedFriends();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopColor: COLOR.main4,
        borderBottomColor: COLOR.main4,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 4,
        paddingLeft: 24,
      }}
    >
      {favoriteFriends.map((friend) => (
        <TouchableOpacity
          key={`ff-${friend.accountId}`}
          onPress={() => pressDeleteName(friend.accountId)}
          style={{
            flexDirection: 'row',
            backgroundColor: COLOR.main4,
            borderRadius: 30,
            paddingLeft: 10,
            paddingRight: 4,
            paddingVertical: 4,
            alignItems: 'center',
            marginRight: 8,
          }}
        >
          <Text style={{ fontFamily: 'Apple', fontSize: 14, color: COLOR.sub1, marginRight: 8 }}>
            {friend.name}
          </Text>
          <ExitIcon />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SelectedFriends;
