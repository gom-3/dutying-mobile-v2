import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ColorPickers, {
  Panel1,
  HueCircular,
  PreviewText,
  type ColorFormatsObject,
} from 'reanimated-color-picker';
import CheckIcon from '@/assets/svgs/check.svg';
import PlusIcon from '@/assets/svgs/plus-gray.svg';
import BottomSheetHeader from '@/components/BottomSheetHeader';
import { COLOR } from '@/styles';

interface Props {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker = ({ color, onChange }: Props) => {
  const ref = useRef<BottomSheetModal>(null);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} />,
    [],
  );

  const onSelectColor = (color: ColorFormatsObject) => {
    onChange(color.hex);
  };

  return (
    <View>
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
          ref.current?.present();
        }}
      >
        <View style={[styles.color, { backgroundColor: color }]}>
          {color === 'white' && <PlusIcon />}
        </View>
      </Pressable>
      <BottomSheetModal
        ref={ref}
        index={1}
        enableContentPanningGesture={false}
        snapPoints={[300, 500]}
        handleComponent={null}
        backdropComponent={renderBackdrop}
        onChange={(index) => {
          if (index !== 1) ref.current?.close();
        }}
        style={{ padding: 15 }}
      >
        <BottomSheetHeader
          onPressExit={() => ref.current?.close()}
          rightItems={
            <TouchableOpacity onPress={() => ref.current?.close()}>
              <CheckIcon />
            </TouchableOpacity>
          }
        />
        <View style={styles.pickerContainer}>
          <ColorPickers
            value={color}
            sliderThickness={20}
            thumbSize={24}
            onChange={onSelectColor}
            boundedThumb
          >
            <HueCircular containerStyle={styles.hueContainer} thumbShape="pill">
              <Panel1 style={styles.panelStyle} />
            </HueCircular>
            <View style={styles.previewTxtContainer}>
              <PreviewText style={{ color: '#707070' }} colorFormat="hsl" />
            </View>
          </ColorPickers>
        </View>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  color: {
    width: 54,
    height: 54,
    marginTop: 16,
    borderRadius: 5,
    borderColor: COLOR.sub4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    alignSelf: 'center',
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },
  hueContainer: {
    justifyContent: 'center',
  },
  panelStyle: {
    width: '70%',
    height: '70%',
    alignSelf: 'center',
    borderRadius: 16,
  },
  previewTxtContainer: {
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#bebdbe',
  },
});

export default ColorPicker;
