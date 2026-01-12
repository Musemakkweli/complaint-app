declare module 'react-native-keyboard-aware-scroll-view' {
  import { ComponentType, ReactNode } from 'react';
    import { ScrollViewProps } from 'react-native';

  interface KeyboardAwareScrollViewProps extends ScrollViewProps {
    enableOnAndroid?: boolean;
    extraHeight?: number;
    extraScrollHeight?: number;
    keyboardOpeningTime?: number;
    contentContainerStyle?: object;
    children?: ReactNode;
  }

  export const KeyboardAwareScrollView: ComponentType<KeyboardAwareScrollViewProps>;
  export default KeyboardAwareScrollView;
}
