# Handla Mobile App - Claude Context

## Project Overview
Handla is a React Native mobile application for iOS and Android built with Expo.

## Tech Stack
- **Framework**: React Native with Expo SDK
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: TBD (Redux Toolkit / Zustand / Context)
- **Styling**: TBD (NativeWind / StyleSheet / Tamagui)
- **API Client**: TBD (Axios / fetch / React Query)
- **Testing**: Jest + React Native Testing Library

## Project Structure
```
src/
├── app/              # Expo Router screens (file-based routing)
├── components/       # Reusable UI components
│   ├── common/       # Buttons, inputs, cards, etc.
│   ├── forms/        # Form-specific components
│   ├── layout/       # Layout components (headers, footers)
│   └── screens/      # Screen-specific components
├── hooks/            # Custom React hooks
├── services/         # API, storage, auth services
├── store/            # State management
├── utils/            # Utility functions
├── constants/        # App constants
├── types/            # TypeScript types/interfaces
├── navigation/       # Navigation configuration
├── assets/           # Images, fonts, icons
├── i18n/             # Internationalization
├── config/           # App configuration
└── theme/            # Theme definitions
```

## Claude Folders
- `.claude/specs/` - Feature and API specifications
- `.claude/planning/` - Architecture decisions and sprint planning
- `.claude/docs/` - Documentation for Claude context
- `.claude/context/` - Additional context files
- `.claude/commands/` - Custom Claude slash commands

## Commands
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm test` - Run tests

## Conventions
- Use TypeScript strict mode
- Follow ESLint + Prettier configuration
- Component files use PascalCase
- Utility files use camelCase
- One component per file
- Colocate tests with source files or in __tests__
