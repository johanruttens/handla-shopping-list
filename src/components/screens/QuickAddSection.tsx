import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Plus, Clock, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { ShoppingItem, Favorite } from '../../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface QuickAddChipProps {
  name: string;
  onPress: () => void;
  variant?: 'recent' | 'suggestion';
}

function QuickAddChip({ name, onPress, variant = 'recent' }: QuickAddChipProps) {
  const { colors, borderRadius, spacing, typography } = useTheme();
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
    onPress();
  };

  return (
    <AnimatedPressable onPress={handlePress} style={animatedStyle}>
      <View
        style={[
          styles.chip,
          {
            backgroundColor: variant === 'suggestion' ? colors.primaryLight : colors.surface,
            borderRadius: borderRadius.lg,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            marginRight: spacing.sm,
          },
        ]}
      >
        <Plus size={14} color={variant === 'suggestion' ? colors.primarySuggestion : colors.textSecondary} />
        <Text
          style={[
            styles.chipText,
            {
              color: variant === 'suggestion' ? colors.primarySuggestion : colors.text,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.medium,
              marginLeft: spacing.xs,
            },
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

interface QuickAddSectionProps {
  title: string;
  icon: 'recent' | 'suggestion';
  items: (ShoppingItem | Favorite)[];
  onAddItem: (item: ShoppingItem | Favorite) => void;
}

export function QuickAddSection({
  title,
  icon,
  items,
  onAddItem,
}: QuickAddSectionProps) {
  const { colors, spacing, typography } = useTheme();

  if (items.length === 0) return null;

  const IconComponent = icon === 'recent' ? Clock : Sparkles;

  return (
    <View style={[styles.container, { marginTop: spacing.lg, paddingHorizontal: spacing.lg }]}>
      <View style={styles.header}>
        <IconComponent size={16} color={colors.textSecondary} />
        <Text
          style={[
            styles.title,
            {
              color: colors.textSecondary,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.medium,
              marginLeft: spacing.xs,
            },
          ]}
        >
          {title}
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingRight: spacing.lg }]}
      >
        {items.map((item) => (
          <QuickAddChip
            key={item.id}
            name={item.name}
            onPress={() => onAddItem(item)}
            variant={icon === 'suggestion' ? 'suggestion' : 'recent'}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {},
  scrollView: {
    marginLeft: -4,
  },
  scrollContent: {
    paddingLeft: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {},
});
