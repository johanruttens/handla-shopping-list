# Handla

A beautiful, offline-first shopping list app built with React Native and Expo.

## Features

- **Offline-First**: Works without internet connection using local SQLite storage
- **Multi-Language Support**: Available in 6 languages (English, Dutch, German, Spanish, Swedish, French)
- **Dark Mode**: Automatic theme switching based on system preferences
- **Intuitive Gestures**: Swipe to edit or delete items
- **Categories**: Organize items by category (Produce, Dairy, Meat, etc.)
- **Favorites**: Save frequently bought items for quick access
- **Celebration**: Fun confetti animation when you complete your shopping list

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Database**: Expo SQLite (offline-first)
- **Animations**: React Native Reanimated
- **Icons**: Lucide React Native
- **Internationalization**: i18n-js

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/handla.git
cd handla

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Simulator

```bash
# iOS
npm run ios

# Android
npm run android
```

## Project Structure

```
src/
├── app/                  # Expo Router screens
│   ├── (tabs)/           # Tab navigation screens
│   ├── onboarding/       # Onboarding flow
│   └── item/             # Item add/edit modals
├── components/           # Reusable UI components
│   ├── common/           # Buttons, inputs, cards
│   ├── forms/            # Form-specific components
│   └── screens/          # Screen-specific components
├── hooks/                # Custom React hooks
├── i18n/                 # Internationalization
│   └── locales/          # Language files
├── services/             # API and database services
│   └── database/         # SQLite operations
├── store/                # Zustand state management
├── theme/                # Theme definitions
├── types/                # TypeScript types
└── utils/                # Utility functions
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Supported Languages

| Language | Code |
|----------|------|
| English | en |
| Dutch | nl |
| German | de |
| Spanish | es |
| Swedish | sv |
| French | fr |

## App Store

App Store metadata and screenshots are available in the `app-store-metadata/` folder, organized by language.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

Johan Ruttens

---

Built with React Native and Expo
