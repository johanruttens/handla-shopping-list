import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import { Language } from '../types';

import en from './locales/en';
import nl from './locales/nl';
import de from './locales/de';
import es from './locales/es';
import sv from './locales/sv';
import fr from './locales/fr';

export const i18n = new I18n({
  en,
  nl,
  de,
  es,
  sv,
  fr,
});

// Set default locale
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

// Get device locale
export function getDeviceLocale(): Language {
  const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en';
  const supportedLocales: Language[] = ['en', 'nl', 'de', 'es', 'sv', 'fr'];
  return supportedLocales.includes(deviceLocale as Language)
    ? (deviceLocale as Language)
    : 'en';
}

// Set the i18n locale
export function setLocale(locale: Language): void {
  i18n.locale = locale;
}

// Translation helper
export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options);
}

// Get random greeting
export function getRandomGreeting(name: string): string {
  // Get the raw greetings array from the current locale
  const locale = i18n.locale || i18n.defaultLocale;
  const translations = i18n.translations[locale] || i18n.translations[i18n.defaultLocale];
  const greetings = translations?.home?.funnyGreetings as string[] || [];

  if (greetings.length === 0) {
    return i18n.t('home.greeting', { name });
  }

  const randomIndex = Math.floor(Math.random() * greetings.length);
  // Manually replace %{name} with the actual name
  return greetings[randomIndex].replace(/%\{name\}/g, name);
}

// Language options for language picker
export const languageOptions = [
  { code: 'en' as Language, name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'nl' as Language, name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'de' as Language, name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'es' as Language, name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'sv' as Language, name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'fr' as Language, name: 'French', nativeName: 'Français', flag: '🇫🇷' },
];

export default i18n;
