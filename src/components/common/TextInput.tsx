import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
}

export function TextInput({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  testID,
  ...props
}: TextInputProps) {
  const { colors, borderRadius, typography, spacing } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderColorValue = useSharedValue(colors.border);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: borderColorValue.value,
  }));

  const handleFocus = () => {
    setIsFocused(true);
    borderColorValue.value = withTiming(colors.primary, { duration: 150 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColorValue.value = withTiming(
      error ? colors.error : colors.border,
      { duration: 150 }
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: error ? colors.error : colors.textSecondary,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.medium,
              marginBottom: spacing.xs,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderRadius: borderRadius.md,
            borderWidth: 1,
            borderColor: error ? colors.error : colors.border,
          },
          animatedBorderStyle,
        ]}
      >
        <RNTextInput
          {...props}
          testID={testID}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.textTertiary}
          style={[
            styles.input,
            {
              color: colors.text,
              fontSize: typography.sizes.body,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.md,
            },
            inputStyle,
          ]}
        />
      </Animated.View>
      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            {
              color: error ? colors.error : colors.textTertiary,
              fontSize: typography.sizes.xs,
              marginTop: spacing.xs,
            },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {},
  inputContainer: {
    overflow: 'hidden',
  },
  input: {
    width: '100%',
  },
  helperText: {},
});
