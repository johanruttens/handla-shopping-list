import { Redirect } from 'expo-router';
import { useAppStore } from '../src/store/useAppStore';

export default function Index() {
  const hasCompletedOnboarding = useAppStore(
    (state) => state.hasCompletedOnboarding
  );

  // Redirect based on onboarding status
  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding/language" />;
  }

  return <Redirect href="/(tabs)" />;
}
