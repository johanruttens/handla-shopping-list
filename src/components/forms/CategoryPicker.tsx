import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Apple,
  Milk,
  Beef,
  Croissant,
  Snowflake,
  Coffee,
  Cookie,
  Home,
  Sparkles,
  Package,
  LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Category } from '../../types';
import { i18n } from '../../i18n';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CategoryPickerProps {
  value: Category;
  onChange: (category: Category) => void;
  label?: string;
}

const categoryIcons: Record<Category, LucideIcon> = {
  produce: Apple,
  dairy: Milk,
  meat: Beef,
  bakery: Croissant,
  frozen: Snowflake,
  beverages: Coffee,
  snacks: Cookie,
  household: Home,
  personal: Sparkles,
  other: Package,
};

const categories: Category[] = [
  'produce',
  'dairy',
  'meat',
  'bakery',
  'frozen',
  'beverages',
  'snacks',
  'household',
  'personal',
  'other',
];

interface CategoryButtonProps {
  category: Category;
  selected: boolean;
  onSelect: () => void;
}

function CategoryButton({ category, selected, onSelect }: CategoryButtonProps) {
  const { colors, borderRadius, typography, spacing } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect();
  };

  const Icon = categoryIcons[category];
  const label = i18n.t(`categories.${category}`);

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.categoryButton, animatedStyle]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: selected ? colors.primary : colors.surface,
            borderRadius: borderRadius.md,
            borderWidth: 1,
            borderColor: selected ? colors.primary : colors.border,
            padding: spacing.md,
          },
        ]}
      >
        <Icon
          size={24}
          color={selected ? '#FFFFFF' : colors.textSecondary}
          strokeWidth={1.5}
        />
      </View>
      <Text
        style={[
          styles.categoryLabel,
          {
            color: selected ? colors.text : colors.textSecondary,
            fontSize: typography.sizes.xs,
            fontWeight: selected
              ? typography.weights.medium
              : typography.weights.regular,
            marginTop: spacing.xs,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export function CategoryPicker({ value, onChange, label }: CategoryPickerProps) {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.textSecondary,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.medium,
              marginBottom: spacing.sm,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <View style={styles.grid}>
        {categories.map((category) => (
          <CategoryButton
            key={category}
            category={category}
            selected={value === category}
            onSelect={() => onChange(category)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    width: '20%',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    textAlign: 'center',
  },
});
