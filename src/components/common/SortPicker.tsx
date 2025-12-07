import React from 'react';
import { ActionSheetIOS, Platform, Alert } from 'react-native';
import { ArrowUpDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme/ThemeContext';
import { SortOption, SortDirection } from '../../types';
import { i18n } from '../../i18n';
import { IconButton } from './IconButton';

interface SortPickerProps {
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortByChange: (sort: SortOption) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
}

const sortOptions: { key: SortOption; labelKey: string }[] = [
  { key: 'name', labelKey: 'list.sort.name' },
  { key: 'category', labelKey: 'list.sort.category' },
  { key: 'dateAdded', labelKey: 'list.sort.dateAdded' },
  { key: 'dateUpdated', labelKey: 'list.sort.dateUpdated' },
];

export function SortPicker({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}: SortPickerProps) {
  const { colors } = useTheme();

  const handleSortPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Build options with checkmarks for current selection
    const options = sortOptions.map((opt) => {
      const label = i18n.t(opt.labelKey);
      const isSelected = opt.key === sortBy;
      return isSelected ? `✓ ${label}` : label;
    });

    // Add direction toggle option
    const directionLabel = sortDirection === 'asc'
      ? `↑ ${i18n.t('list.sort.ascending')}`
      : `↓ ${i18n.t('list.sort.descending')}`;

    const allOptions = [...options, directionLabel];
    const cancelButtonIndex = allOptions.length;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...allOptions, i18n.t('common.cancel')],
          cancelButtonIndex,
          title: i18n.t('list.sort.title'),
        },
        (buttonIndex) => {
          if (buttonIndex < sortOptions.length) {
            onSortByChange(sortOptions[buttonIndex].key);
          } else if (buttonIndex === sortOptions.length) {
            // Toggle direction
            onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc');
          }
        }
      );
    } else {
      const alertOptions = sortOptions.map((opt) => {
        const label = i18n.t(opt.labelKey);
        const isSelected = opt.key === sortBy;
        return {
          text: isSelected ? `✓ ${label}` : label,
          onPress: () => onSortByChange(opt.key),
        };
      });

      alertOptions.push({
        text: directionLabel,
        onPress: () => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc'),
      });

      Alert.alert(
        i18n.t('list.sort.title'),
        undefined,
        [...alertOptions, { text: i18n.t('common.cancel'), style: 'cancel' }]
      );
    }
  };

  return (
    <IconButton
      icon={<ArrowUpDown size={20} color={colors.textSecondary} />}
      onPress={handleSortPress}
      variant="ghost"
      size="sm"
      testID="sort-picker"
      accessibilityLabel="Sort options"
    />
  );
}
