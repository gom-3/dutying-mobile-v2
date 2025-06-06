import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CheckButtonChecked from '@/assets/svgs/check-button-checked.svg';
import CheckButton from '@/assets/svgs/check-button.svg';
import CheckIcon from '@/assets/svgs/check.svg';
import PencilIcon from '@/assets/svgs/pencil.svg';
import TrashIcon from '@/assets/svgs/trash.svg';
import BottomSheetHeader from '@/components/BottomSheetHeader';
import ColorPicker from '@/components/ColorPicker';
import PageHeader from '@/components/PageHeader';
import PageViewContainer from '@/components/PageView';
import { COLOR } from '@/styles';
import useDeviceCalendarPage from './index.hook';

const DeviceCalendarPage = () => {
  const {
    states: {
      isValid,
      isEdit,
      textRef,
      color,
      name,
      ref,
      normalCalendars,
      dutyingCalendars,
      calendarLink,
    },
    actions: {
      pressLinkHandler,
      openModalCreateMode,
      openModalEditMode,
      setColor,
      createCalendar,
      deleteCalendar,
      setIsValid,
    },
  } = useDeviceCalendarPage();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} />,
    [],
  );

  return (
    <PageViewContainer>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <PageHeader title="캘린더 연동" />
          <View style={styles.header}>
            <Text style={styles.headerName}>듀팅 캘린더</Text>
            <Pressable onPress={openModalCreateMode}>
              <Text style={styles.add}>추가하기</Text>
            </Pressable>
          </View>
          <ScrollView>
            {dutyingCalendars.map((calendar) => (
              <View style={styles.item} key={calendar.id}>
                <View style={styles.itemLeft}>
                  <Pressable onPress={() => pressLinkHandler(calendar.id)}>
                    {calendarLink[calendar.id] ? <CheckButtonChecked /> : <CheckButton />}
                  </Pressable>
                  <View style={[{ backgroundColor: calendar.color }, styles.color]} />
                  <Text style={styles.itemText}>{calendar.title.slice(3)}</Text>
                </View>
                <Pressable onPress={() => openModalEditMode(calendar)}>
                  <PencilIcon />
                </Pressable>
              </View>
            ))}
            <View style={styles.header}>
              <Text style={styles.headerName}>기기 캘린더</Text>
            </View>
            {normalCalendars.map((calendar) => (
              <View style={styles.item} key={calendar.id}>
                <View style={styles.itemLeft}>
                  <Pressable onPress={() => pressLinkHandler(calendar.id)}>
                    {calendarLink[calendar.id] ? <CheckButtonChecked /> : <CheckButton />}
                  </Pressable>
                  <View style={[{ backgroundColor: calendar.color }, styles.color]} />
                  <Text style={styles.itemText}>{calendar.title}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <BottomSheetModal
            style={{ padding: 14 }}
            ref={ref}
            index={1}
            enableContentPanningGesture={false}
            snapPoints={[100, 400]}
            handleComponent={null}
            backdropComponent={renderBackdrop}
            keyboardBehavior="interactive"
            onChange={(index) => {
              if (index !== 1) ref.current?.close();
            }}
          >
            <BottomSheetView style={{ flex: 1 }}>
              <BottomSheetHeader
                title={isEdit ? '편집' : '추가'}
                titleMargin={isEdit ? 38 : 0}
                rightItems={
                  <View style={{ flexDirection: 'row' }}>
                    {isEdit && (
                      <Pressable style={{ marginRight: 14 }} onPress={deleteCalendar}>
                        <TrashIcon />
                      </Pressable>
                    )}
                    <Pressable onPress={createCalendar}>
                      <CheckIcon />
                    </Pressable>
                  </View>
                }
                onPressExit={() => {}}
              />
              <View style={{ padding: 10 }}>
                <BottomSheetTextInput
                  maxLength={10}
                  onChangeText={(text) => {
                    textRef.current = text;
                    setIsValid((prev) => ({ ...prev, name: true }));
                  }}
                  style={[
                    styles.input,
                    { borderColor: isValid.name ? COLOR.main4 : COLOR.invalidBorder },
                  ]}
                  placeholder="유형 이름"
                  defaultValue={isEdit ? name : ''}
                />
                {isValid.name ? (
                  <Text style={styles.inputGuideText}>캘린더에 표시되는 일정을 분류해보세요.</Text>
                ) : (
                  <Text style={[styles.inputGuideText, { color: COLOR.invalidText }]}>
                    올바른 이름이 아닙니다. 다시 한번 확인해주세요.
                  </Text>
                )}
                <Text style={styles.modalColorText}>색상</Text>
                <ColorPicker
                  color={color.length > 0 ? color : 'white'}
                  onChange={(color) => {
                    setColor(color);
                    setIsValid((prev) => ({ ...prev, color: true }));
                  }}
                />
                {!isValid.color && (
                  <Text style={[styles.inputGuideText, { color: COLOR.invalidText }]}>
                    색상을 선택해주세요.
                  </Text>
                )}
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 5,
    borderWidth: 0.5,
    width: '100%',
    fontSize: 20,
    fontFamily: 'Apple',
    color: COLOR.sub1,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  color: {
    width: 24,
    height: 24,
    marginHorizontal: 16,
    borderRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 20,
  },
  headerName: {
    fontFamily: 'Apple',
    fontSize: 13,
    color: COLOR.sub3,
  },
  add: {
    color: COLOR.main2,
    fontSize: 13,
    fontFamily: 'Apple500',
    textDecorationColor: COLOR.main2,
    textDecorationLine: 'underline',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontFamily: 'Apple',
    color: COLOR.sub2,
    fontSize: 16,
  },
  inputGuideText: {
    color: COLOR.sub3,
    fontSize: 12,
    fontFamily: 'Apple',
    marginTop: 10,
  },
  modalColorText: {
    color: COLOR.sub3,
    fontSize: 16,
    fontFamily: 'Apple',
    marginTop: 42,
  },
});

export default DeviceCalendarPage;
