Create a complete React Native mobile shopping list app using Expo, ready for deployment to both Google Play Store and Apple App Store.

## App Overview
A minimal, elegant shopping list app with offline-first functionality, multi-language support, and a premium design aesthetic inspired by Bang & Olufsen and Apple.

## Technical Requirements
- Use Expo with TypeScript
- Expo Router for navigation
- SQLite (expo-sqlite) for local database storage
- Zustand for state management
- NativeWind for styling
- expo-localization + i18n-js for translations
- No external API calls - fully offline capable

## Supported Languages (6)
- English (en) - default
- Dutch (nl)
- German (de)
- Spanish (es)
- Swedish (sv)
- French (fr)

## Core Features

### 1. Onboarding (First Launch Only)
- Language selection screen with flag icons
- Name input field
- Smooth animated transitions
- Data persisted to SQLite

### 2. Home Screen
- Personalized greeting with user's name
- Random funny greeting line (10+ per language, shown randomly)
- Example greetings:
    - EN: "Time to hunt for groceries, {name}!", "Let's make your fridge happy, {name}!"
    - NL: "Tijd om te hamsteren, {name}!", "Laten we je koelkast blij maken, {name}!"
    - (Create similar witty greetings for all 6 languages)
- Quick stats: items to buy, items bought today
- Primary CTA: "Start Shopping" or "View List"

### 3. Shopping List Screen
- Clean list view with items grouped by category (optional)
- Each item shows:
    - Item name
    - Amount/quantity with unit (e.g., "2 kg", "3 pieces", "1 bottle")
    - Checkbox to mark as bought (with strikethrough animation)
    - Favorite heart icon
    - Swipe actions: edit, delete
- Floating Action Button (FAB) to add new item
- Filter tabs: All | To Buy | Bought
- "Clear bought items" action

### 4. Add/Edit Item Screen
- Item name input (required)
- Amount input with increment/decrement buttons
- Unit selector: pieces, kg, g, L, mL, bottles, cans, packs, boxes
- Category selector: Produce, Dairy, Meat, Bakery, Frozen, Beverages, Snacks, Household, Personal Care, Other
- "Add to favorites" toggle
- Save / Cancel buttons

### 5. Favorites Screen
- List of favorite items
- Multi-select mode to add multiple items to shopping list at once
- "Add Selected to List" CTA button (shows count)
- Long press to remove from favorites
- Empty state with helpful message

### 6. Settings Screen
- Change display name
- Change language (with immediate UI update)
- App theme: Light / Dark / System
- Clear all data (with confirmation)
- About section with version number

## Database Schema (SQLite)
```sql
-- User preferences
CREATE TABLE user_settings (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'system',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Shopping list items
CREATE TABLE shopping_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  amount REAL DEFAULT 1,
  unit TEXT DEFAULT 'pieces',
  category TEXT DEFAULT 'Other',
  is_bought INTEGER DEFAULT 0,
  is_favorite INTEGER DEFAULT 0,
  bought_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Favorites (separate for clean architecture)
CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  default_amount REAL DEFAULT 1,
  default_unit TEXT DEFAULT 'pieces',
  category TEXT DEFAULT 'Other',
  usage_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Design Requirements

### Visual Style
- Minimalist, lots of whitespace
- Clean sans-serif typography (SF Pro or Inter)
- Monochromatic base (white/off-white backgrounds, black/dark gray text)
- Single accent color for CTAs: sophisticated blue (#0071E3) or warm coral (#FF6B6B)
- Subtle shadows and rounded corners (12-16px radius)
- Micro-animations for interactions (checkbox, swipe, transitions)

### Component Styling
- Cards with subtle elevation
- Large touch targets (minimum 44px)
- CTAs: Bold, full-width buttons with accent color, high contrast
- Icons: Lucide React Native, thin stroke weight
- Empty states: Elegant illustrations or icons with helpful text

### Typography Scale
- Greeting/Headers: 28-32px, semibold
- Section titles: 20px, medium
- Body/List items: 16-17px, regular
- Captions: 13-14px, light gray

### Smart Features
1. **Recent items**: Quick-add from recently used items
2. **Smart suggestions**: Based on frequently bought items, suggest additions
3. **Shopping history**: View past shopping sessions
4. **Quantity presets**: Remember last used quantity per item

### UX Enhancements
5. **Haptic feedback**: Subtle vibration on checkbox tap and swipe actions
6. **Pull to refresh**: Animate the greeting to show a new random message
7. **Search**: Filter items by name in the shopping list
8. **Sort options**: By name, category, or date added
9. **Undo**: Toast notification with undo option when deleting items

### Engagement
10. **Daily streak**: Track consecutive days of app usage
11. **Completion celebration**: Subtle confetti or checkmark animation when all items are bought
12. **Widget support**: iOS/Android home screen widget showing item count

## File Structure
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx (redirects based on onboarding status)
│   ├── onboarding/
│   │   ├── language.tsx
│   │   └── name.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx (home)
│   │   ├── list.tsx
│   │   ├── favorites.tsx
│   │   └── settings.tsx
│   └── item/
│       ├── add.tsx
│       └── [id].tsx (edit)
├── components/
│   ├── ui/ (Button, Card, Input, Checkbox, etc.)
│   └── features/ (ShoppingItem, FavoriteItem, etc.)
├── db/
│   ├── schema.ts
│   ├── migrations.ts
│   └── queries.ts
├── i18n/
│   ├── index.ts
│   └── locales/
│       ├── en.json
│       ├── nl.json
│       ├── de.json
│       ├── es.json
│       ├── sv.json
│       └── fr.json
├── stores/
│   ├── useSettingsStore.ts
│   └── useShoppingStore.ts
├── hooks/
│   ├── useDatabase.ts
│   └── useGreeting.ts
├── constants/
│   ├── theme.ts
│   ├── categories.ts
│   └── units.ts
└── types/
└── index.ts

## Deployment Preparation
- Configure app.config.ts for both platforms
- Set up eas.json with development, preview, and production profiles
- Include proper app icons (1024x1024 source)
- Include splash screen with app logo
- Configure proper bundle identifiers

Please build this app step by step, starting with:
1. Project initialization and dependencies
2. Database setup
3. i18n configuration with all translations
4. Onboarding flow
5. Core shopping list functionality
6. Favorites feature
7. Settings
8. Polish and animations
