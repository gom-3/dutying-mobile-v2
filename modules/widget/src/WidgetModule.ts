import { NativeModule, requireNativeModule } from 'expo';

import { WidgetModuleEvents } from './Widget.types';

declare class WidgetModule extends NativeModule<WidgetModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<WidgetModule>('Widget');
