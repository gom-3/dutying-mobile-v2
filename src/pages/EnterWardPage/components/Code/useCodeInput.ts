import Clipboard from 'expo-clipboard';
import { useEffect, useRef, useState } from 'react';
import { type TextInput } from 'react-native-gesture-handler';

const useCodeInput = () => {
  const [code, setCode] = useState<string>('');
  const mainCodeInputRef = useRef<TextInput>(null);

  const handleMainInputChange = (text: string) => {
    if (text.length > 0 && /[^0-9a-zA-Z]/.test(text)) return;
    if (text.length <= 6) {
      setCode(text.toUpperCase());
    }
  };

  const handlePasteCode = async () => {
    const copiedContent = (await Clipboard.getStringAsync())
      .trim()
      .toUpperCase()
      .replace(/[^0-9a-zA-Z]/g, '');
    setCode(copiedContent.slice(0, 6));
  };

  useEffect(() => {
    if (mainCodeInputRef.current) mainCodeInputRef.current.focus();
  }, []);

  return {
    states: { code, mainCodeInputRef },
    actions: {
      handleMainInputChange,
      handlePasteCode,
    },
  };
};

export default useCodeInput;
