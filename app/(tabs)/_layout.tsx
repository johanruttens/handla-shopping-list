import { Tabs } from 'expo-router';
import { Home, ShoppingCart, Heart, Settings } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { i18n } from '../../src/i18n';
import { useAppStore } from '../../src/store/useAppStore';

export default function TabsLayout() {
  const { colors } = useTheme();
  const language = useAppStore((state) => state.language);

  // Ensure i18n is synced
  i18n.locale = language;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: i18n.t('list.title'),
          tabBarIcon: ({ color, size }) => (
            <ShoppingCart size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: i18n.t('favorites.title'),
          tabBarIcon: ({ color, size }) => (
            <Heart size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: i18n.t('settings.title'),
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
