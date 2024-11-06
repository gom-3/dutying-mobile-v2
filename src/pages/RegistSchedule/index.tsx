import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { type RouteProp, useRoute } from '@react-navigation/native';
import {
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CheckIcon from '@/assets/svgs/check.svg';
import TrashIcon from '@/assets/svgs/trash.svg';
import KeyboardAvoidWrapper from '@/components/KeyboardAvoidWrapper';
import PageHeader from '@/components/PageHeader';
import PageViewContainer from '@/components/PageView';
import { COLOR, screenHeight, screenWidth } from '@/styles';
import Alarm from './components/Alarm';
import Category from './components/Category';
import ModalContext from './components/ModalContext';
import Repeat from './components/Repeat';
import Time from './components/Time';
import useRegistSchedule from './index.hook';

const RegistSchedulePage = () => {
  const route = useRoute<RouteProp<{ params: { isEdit: boolean } }>>();
  const { params } = route;
  const isEdit = params ? params.isEdit : false;
  const {
    state: { title, ref, isModalOpen, modalRef, notes },
    actions: {
      titleChangeHandler,
      createEvent,
      updateEvent,
      deleteEvent,
      openModal,
      notesChangeHandler,
      closeModal,
    },
  } = useRegistSchedule();

  return (
    <PageViewContainer style={{ backgroundColor: COLOR.bg }}>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <KeyboardAvoidWrapper>
            <PageHeader
              backgroundColor={COLOR.bg}
              title={isEdit ? '일정 수정' : '일정 등록'}
              titleMargin={isEdit ? 38 : 0}
              rightItems={
                <View style={styles.headerIcons}>
                  {isEdit && (
                    <TouchableOpacity style={styles.trashIcon} onPress={deleteEvent}>
                      <TrashIcon />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={isEdit ? updateEvent : createEvent}>
                    <CheckIcon />
                  </TouchableOpacity>
                </View>
              }
            />
            <View style={{ backgroundColor: COLOR.bg, paddingVertical: 10 }}>
              <TextInput
                autoFocus={Platform.OS === 'android'}
                value={title}
                onChangeText={titleChangeHandler}
                style={styles.title}
                placeholder="제목"
                placeholderTextColor={COLOR.sub3}
              />
            </View>
            <Category />
            <Time />
            <Alarm openModal={() => openModal('alarm')} />
            <Repeat openModal={() => openModal('reculsive')} />
            <Text
              style={{
                color: COLOR.sub2,
                fontFamily: 'Apple500',
                fontSize: 16,
                paddingHorizontal: 24,
                paddingVertical: 10,
                borderTopColor: '#d6d6de',
                borderTopWidth: 0.5,
              }}
            >
              메모
            </Text>
            <TextInput
              multiline
              onFocus={() => ref.current?.scrollToEnd()}
              style={{
                backgroundColor: COLOR.bg,
                borderColor: COLOR.sub5,
                borderWidth: 0.5,
                marginHorizontal: 24,
                borderRadius: 5,
                minHeight: 169,
              }}
              value={notes}
              onChangeText={notesChangeHandler}
            />
            <View style={{ height: 150 }} />
          </KeyboardAvoidWrapper>
          <BottomSheetModal
            enableContentPanningGesture={false}
            ref={modalRef}
            index={1}
            snapPoints={[200, 350]}
            handleComponent={null}
            onChange={(index) => {
              if (index !== 1) closeModal();
            }}
          >
            <ModalContext closeModal={closeModal} />
          </BottomSheetModal>
          {isModalOpen && (
            <Pressable
              style={{
                backgroundColor: 'black',
                opacity: 0.5,
                width: screenWidth,
                height: screenHeight,
                position: 'absolute',
              }}
              onPress={closeModal}
            />
          )}
        </SafeAreaView>
      </BottomSheetModalProvider>
    </PageViewContainer>
  );
};

const styles = StyleSheet.create({
  headerIcons: {
    flexDirection: 'row',
  },
  trashIcon: {
    marginRight: 14,
  },
  title: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: COLOR.main4,
    borderRadius: 5,
    fontSize: 20,
    fontFamily: 'Apple',
    color: COLOR.sub1,
    marginHorizontal: 24,
    marginVertical: 14,
  },
});

export default RegistSchedulePage;
