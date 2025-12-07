import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Heart, Trash2, Pencil } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Checkbox } from '../common/Checkbox';
import { ShoppingItem } from '../../types';
import { i18n } from '../../i18n';

interface ShoppingItemRowProps {
  item: ShoppingItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SWIPE_THRESHOLD = 80;

export function ShoppingItemRow({
  item,
  onToggle,
  onEdit,
  onDelete,
}: ShoppingItemRowProps) {
  const { colors, borderRadius, typography, spacing, shadows } = useTheme();
  const translateX = useSharedValue(0);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      translateX.value = Math.max(-160, Math.min(0, event.translationX));
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-160, { damping: 20 });
        runOnJS(triggerHaptic)();
      } else {
        translateX.value = withSpring(0, { damping: 20 });
      }
    });

  const animatedRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedActionsStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.abs(translateX.value) / SWIPE_THRESHOLD),
  }));

  const closeSwipe = () => {
    translateX.value = withSpring(0, { damping: 20 });
  };

  const handleEdit = () => {
    closeSwipe();
    onEdit();
  };

  const handleDelete = () => {
    closeSwipe();
    onDelete();
  };

  const unitLabel = i18n.t(`units.${item.unit}Short`);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.actionsContainer, animatedActionsStyle]}>
        <Pressable
          onPress={handleEdit}
          style={[
            styles.actionButton,
            styles.editButton,
            { backgroundColor: colors.primary },
          ]}
        >
          <Pencil size={20} color="#FFFFFF" />
        </Pressable>
        <Pressable
          onPress={handleDelete}
          style={[
            styles.actionButton,
            styles.deleteButton,
            { backgroundColor: colors.error },
          ]}
        >
          <Trash2 size={20} color="#FFFFFF" />
        </Pressable>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.row,
            {
              backgroundColor: colors.background,
              borderRadius: borderRadius.lg,
              ...shadows.sm,
            },
            animatedRowStyle,
          ]}
        >
          <Pressable onPress={onToggle} style={styles.checkboxContainer}>
            <Checkbox
              checked={item.isBought}
              onToggle={onToggle}
              testID="item-checkbox"
              accessibilityLabel={`Mark ${item.name} as ${item.isBought ? 'not bought' : 'bought'}`}
            />
          </Pressable>

          <View style={styles.content}>
            <Text
              style={[
                styles.name,
                {
                  color: item.isBought ? colors.textTertiary : colors.text,
                  fontSize: typography.sizes.body,
                  fontWeight: typography.weights.medium,
                  textDecorationLine: item.isBought ? 'line-through' : 'none',
                },
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.amount,
                {
                  color: item.isBought
                    ? colors.textTertiary
                    : colors.textSecondary,
                  fontSize: typography.sizes.sm,
                },
              ]}
            >
              {item.amount} {unitLabel}
            </Text>
          </View>

          {item.isFavorite && (
            <Heart
              size={16}
              color={colors.primary}
              fill={colors.primary}
              style={{ marginRight: spacing.sm }}
            />
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 8,
  },
  actionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  actionButton: {
    width: 72,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  editButton: {
    marginRight: 8,
  },
  deleteButton: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {},
  amount: {},
});
