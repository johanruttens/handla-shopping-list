import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  testID?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  style,
  testID,
}: SearchBarProps) {
  const { colors, borderRadius, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          paddingHorizontal: spacing.md,
        },
        style,
      ]}
    >
      <Search size={20} color={colors.textTertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        testID={testID}
        accessibilityLabel={placeholder}
        style={[
          styles.input,
          {
            color: colors.text,
            fontSize: typography.sizes.body,
            marginLeft: spacing.sm,
          },
        ]}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={18} color={colors.textTertiary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  input: {
    flex: 1,
    height: '100%',
  },
});
