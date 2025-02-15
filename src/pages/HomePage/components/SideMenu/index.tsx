import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';
import CopyIcon from '@/assets/svgs/copy-purple.svg';
import ExitIcon from '@/assets/svgs/exit.svg';
import SettingIcon from '@/assets/svgs/setting.svg';
import BackDrop from '@/components/BackDrop';
import { COLOR, screenHeight, screenWidth } from '@/styles';
import useSideMenu from './index.hook';

const SideMenu = () => {
  const {
    state: { account, menuItemList },
    actions: { closeSideMenu, navigateToMyPage, copyCode },
  } = useSideMenu();

  return (
    <>
      <BackDrop clickHandler={closeSideMenu} />
      <Animated.View
        style={styles.sideMenuContainer}
        entering={SlideInRight.duration(350)}
        exiting={SlideOutRight.duration(350)}
      >
        <TouchableOpacity onPress={closeSideMenu}>
          <ExitIcon style={styles.exitIcon} />
        </TouchableOpacity>
        <View style={styles.profileView}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{ uri: `data:image/png;base64,${account.profileImgBase64}` }}
              style={{ width: 28, height: 28, borderRadius: 50 }}
            />
            <Text style={styles.profileText}>{account.name}</Text>
          </View>
          <TouchableOpacity onPress={navigateToMyPage}>
            <SettingIcon />
          </TouchableOpacity>
        </View>
        <View style={{ marginLeft: 22, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ backgroundColor: COLOR.main4, padding: 4, borderRadius: 5 }}>
            <Text style={{ color: COLOR.sub2, fontSize: 12, fontFamily: 'Poppins' }}>
              #{account.code}
            </Text>
          </View>
          <TouchableOpacity
            onPress={copyCode}
            style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}
          >
            <CopyIcon />
            <Text style={{ color: COLOR.main2, fontSize: 14, fontFamily: 'Apple', marginLeft: 2 }}>
              복사하기
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.deviderView} />

        {menuItemList.map((item) => (
          <TouchableOpacity key={item.title} onPress={item.onPress}>
            <View style={styles.menuItemView}>
              <item.icon />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  sideMenuContainer: {
    position: 'absolute',
    zIndex: 4,
    backgroundColor: 'white',
    right: 0,
    width: screenWidth * 0.8,
    maxWidth: 310,
    height: screenHeight,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#19181b',
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 20,
    shadowOpacity: 0.4,
    elevation: 8,
    flex: 1,
  },
  exitIcon: {
    marginTop: 66,
    marginLeft: 22,
  },
  profileView: {
    marginTop: 32,
    flexDirection: 'row',
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },
  profileText: {
    fontFamily: 'Apple',
    fontSize: 24,
    marginLeft: 12,
    color: COLOR.sub1,
  },
  deviderView: {
    marginTop: 24,
    width: '100%',
    height: 3,
    backgroundColor: '#f2f2f7',
  },
  menuItemView: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  menuItemText: {
    fontFamily: 'Apple',
    fontSize: 16,
    color: COLOR.sub2,
    marginLeft: 18,
  },
});

export default SideMenu;
