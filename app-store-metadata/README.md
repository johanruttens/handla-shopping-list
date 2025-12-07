# Handla App Store Metadata

This folder contains all the metadata required for publishing Handla on the Apple App Store, organized by language.

## Folder Structure

```
app-store-metadata/
├── README.md
├── en/                          # English (US)
│   ├── metadata/
│   │   ├── description.txt      # App description (max 4000 chars)
│   │   ├── promotional_text.txt # Promotional text (max 170 chars)
│   │   ├── keywords.txt         # Keywords (max 100 chars, comma-separated)
│   │   └── subtitle.txt         # App subtitle (max 30 chars)
│   └── screenshots/
│       └── screenshot_descriptions.txt
├── nl/                          # Dutch
│   ├── metadata/
│   └── screenshots/
├── de/                          # German
│   ├── metadata/
│   └── screenshots/
├── es/                          # Spanish
│   ├── metadata/
│   └── screenshots/
├── sv/                          # Swedish
│   ├── metadata/
│   └── screenshots/
└── fr/                          # French
    ├── metadata/
    └── screenshots/
```

## App Store Connect Languages

| Folder | Language | App Store Locale |
|--------|----------|------------------|
| en | English | en-US |
| nl | Dutch | nl-NL |
| de | German | de-DE |
| es | Spanish | es-ES |
| sv | Swedish | sv-SE |
| fr | French | fr-FR |

## Screenshot Requirements

### iPhone Screenshots (Required)

You need screenshots for at least one of these sizes:
- **6.7" Display** (iPhone 15 Pro Max, 14 Pro Max): 1290 x 2796 pixels
- **6.5" Display** (iPhone 11 Pro Max, XS Max): 1284 x 2778 pixels
- **5.5" Display** (iPhone 8 Plus, 7 Plus): 1242 x 2208 pixels

### Recommended Screenshots (7 total)

1. **01_welcome** - Language selection/onboarding
2. **02_home** - Home screen with personalized greeting
3. **03_list** - Shopping list with items
4. **04_add_item** - Add item modal
5. **05_swipe** - Swipe actions (edit/delete)
6. **06_celebration** - Confetti celebration
7. **07_dark_mode** - Dark mode version

### Screenshot Design Guidelines

- Use the app's accent color: **#FF6B6B** (Warm Coral)
- Include marketing text overlays in each language
- Use device mockups or clean bezels
- Ensure text is large and readable
- Consider gradient or solid color backgrounds

## Metadata Character Limits

| Field | Max Length |
|-------|------------|
| App Name | 30 characters |
| Subtitle | 30 characters |
| Promotional Text | 170 characters |
| Description | 4000 characters |
| Keywords | 100 characters |
| What's New | 4000 characters |

## How to Use

### In App Store Connect:

1. Go to **App Store Connect** → Your App → **App Store** tab
2. Click on a language under **Localizable Information**
3. Copy/paste content from the corresponding metadata files
4. Upload screenshots from the screenshots folder

### Using Fastlane (Recommended):

If you're using Fastlane for automation, you can set up `fastlane deliver` to read from this folder structure.

## Creating Screenshots

### Option 1: Manual Screenshots
1. Run the app in the iOS Simulator
2. Set the language in Settings
3. Take screenshots with `Cmd + S`
4. Use a tool like [Previewed](https://previewed.app) or [AppMockUp](https://app-mockup.com) to add device frames and marketing text

### Option 2: Automated with Fastlane Snapshot
1. Install Fastlane: `brew install fastlane`
2. Set up `fastlane snapshot` with UI tests
3. Configure languages and device sizes
4. Run `fastlane snapshot` to generate all screenshots

### Option 3: Using Maestro
The `.maestro/` folder contains test flows that can be used for screenshot automation:
1. Install Maestro: `curl -Ls "https://get.maestro.mobile.dev" | bash`
2. Build the app: `npx expo run:ios`
3. Run flows with screenshot commands

## App Information (Constant)

These fields are the same across all languages:

- **Bundle ID**: `com.handla.app`
- **SKU**: `handla-app`
- **Primary Category**: Utilities or Shopping
- **Secondary Category**: Lifestyle
- **Price**: Free
- **Age Rating**: 4+

## Checklist Before Submission

- [ ] All descriptions are under 4000 characters
- [ ] All subtitles are under 30 characters
- [ ] All promotional texts are under 170 characters
- [ ] All keywords are under 100 characters
- [ ] Screenshots uploaded for all required device sizes
- [ ] App icon uploaded (1024x1024)
- [ ] Privacy policy URL added
- [ ] Support URL added
- [ ] App builds without errors
- [ ] App tested on physical devices
