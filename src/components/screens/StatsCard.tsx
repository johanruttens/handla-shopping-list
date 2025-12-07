import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShoppingCart, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Card } from '../common/Card';
import { i18n } from '../../i18n';

interface StatsCardProps {
  toBuyCount: number;
  boughtToday: number;
}

export function StatsCard({ toBuyCount, boughtToday }: StatsCardProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const getItemsLeftText = () => {
    if (toBuyCount === 0) {
      return i18n.t('home.noItemsLeft');
    }
    return i18n.t('home.itemsLeft', { count: toBuyCount });
  };

  const getBoughtTodayText = () => {
    return i18n.t('home.boughtToday', { count: boughtToday });
  };

  return (
    <Card variant="filled" padding="md">
      <View style={styles.row}>
        <View style={styles.stat}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.primary + '15',
                borderRadius: borderRadius.md,
                padding: spacing.sm,
              },
            ]}
          >
            <ShoppingCart size={20} color={colors.primary} strokeWidth={2} />
          </View>
          <View style={[styles.textContainer, { marginLeft: spacing.md }]}>
            <Text
              style={[
                styles.value,
                {
                  color: colors.text,
                  fontSize: typography.sizes.xl,
                  fontWeight: typography.weights.bold,
                },
              ]}
            >
              {toBuyCount}
            </Text>
            <Text
              style={[
                styles.label,
                {
                  color: colors.textSecondary,
                  fontSize: typography.sizes.sm,
                },
              ]}
            >
              {getItemsLeftText()}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.divider,
            {
              backgroundColor: colors.border,
              marginHorizontal: spacing.md,
            },
          ]}
        />

        <View style={styles.stat}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.success + '15',
                borderRadius: borderRadius.md,
                padding: spacing.sm,
              },
            ]}
          >
            <CheckCircle size={20} color={colors.success} strokeWidth={2} />
          </View>
          <View style={[styles.textContainer, { marginLeft: spacing.md }]}>
            <Text
              style={[
                styles.value,
                {
                  color: colors.text,
                  fontSize: typography.sizes.xl,
                  fontWeight: typography.weights.bold,
                },
              ]}
            >
              {boughtToday}
            </Text>
            <Text
              style={[
                styles.label,
                {
                  color: colors.textSecondary,
                  fontSize: typography.sizes.sm,
                },
              ]}
            >
              {getBoughtTodayText()}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {},
  textContainer: {},
  value: {},
  label: {},
  divider: {
    width: 1,
    height: 48,
  },
});
