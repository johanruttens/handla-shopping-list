#!/bin/bash

# Screenshot script for App Store 6.7" screenshots
# Run this while manually navigating through the app on iPhone 15 Pro Max simulator

DEVICE_ID="2BAD85E2-B459-4190-9B25-550871FB2B84"  # iPhone 15 Pro Max
OUTPUT_DIR="app-store-metadata/screenshots-6.7/en"
LANG="en"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "========================================"
echo "App Store Screenshot Capture Script"
echo "Device: iPhone 15 Pro Max (6.7\")"
echo "Output: $OUTPUT_DIR"
echo "========================================"
echo ""
echo "Instructions:"
echo "1. Make sure the app is running on iPhone 15 Pro Max"
echo "2. Navigate to each screen and press Enter to capture"
echo "3. Screenshots will be saved to: $OUTPUT_DIR"
echo ""

# Function to take screenshot
take_screenshot() {
    local name=$1
    local filename="${OUTPUT_DIR}/${name}.png"
    echo "Taking screenshot: $name"
    xcrun simctl io "$DEVICE_ID" screenshot "$filename"
    echo "  Saved: $filename"
    echo ""
}

# Screenshot 1: Language Selection
echo ">> Navigate to: Language Selection screen"
read -p "Press Enter when ready..."
take_screenshot "01_language_selection"

# Screenshot 2: Name Input
echo ">> Navigate to: Name input screen (enter a name like 'Emma')"
read -p "Press Enter when ready..."
take_screenshot "02_name_input"

# Screenshot 3: Home Screen
echo ">> Navigate to: Home screen"
read -p "Press Enter when ready..."
take_screenshot "03_home"

# Screenshot 4: Add Item
echo ">> Open: Add Item modal (fill in an item name)"
read -p "Press Enter when ready..."
take_screenshot "04_add_item"

# Screenshot 5: Shopping List
echo ">> Navigate to: Shopping List with several items"
read -p "Press Enter when ready..."
take_screenshot "05_shopping_list"

# Screenshot 6: List with bought items
echo ">> Mark some items as bought"
read -p "Press Enter when ready..."
take_screenshot "06_list_bought"

# Screenshot 7: Celebration
echo ">> Mark all items as bought to trigger celebration"
read -p "Press Enter when ready..."
take_screenshot "07_celebration"

# Screenshot 8: Settings
echo ">> Navigate to: Settings screen"
read -p "Press Enter when ready..."
take_screenshot "08_settings"

echo "========================================"
echo "All screenshots captured!"
echo "Files saved to: $OUTPUT_DIR"
echo ""
ls -la "$OUTPUT_DIR"
echo "========================================"
