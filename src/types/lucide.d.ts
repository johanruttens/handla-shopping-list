// Type augmentation for lucide-react-native
// The library types don't include some props that work at runtime
import 'lucide-react-native';
import { StyleProp, ViewStyle } from 'react-native';

declare module 'lucide-react-native' {
  interface LucideProps {
    color?: string;
    fill?: string;
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
    style?: StyleProp<ViewStyle>;
  }
}
