# ChatApp - Simple React Native Chat Application

A simple chat application built with [React Native](https://reactnative.dev) using the React Native CLI. This project demonstrates the fundamentals of building a real-time messaging application on mobile platforms.

## Project Overview

ChatApp is a basic messaging application that allows users to send and receive messages in real-time. This project serves as a learning resource for understanding React Native development, state management, and UI component building.

### Features

- User authentication and session management
- Real-time message sending and receiving
- Clean and intuitive user interface
- Support for both Android and iOS platforms
- Responsive design for various screen sizes

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) and npm/Yarn
- **Java Development Kit (JDK)** (for Android development)
- **Android Studio** with Android SDK (for Android)
- **Xcode** (for iOS development on macOS)
- React Native CLI

For detailed setup instructions, visit the [React Native Environment Setup Guide](https://reactnative.dev/docs/set-up-your-environment).

## Getting Started

### Step 1: Install Dependencies

Navigate to the project root directory and install the required dependencies:

```sh
# Using npm
npm install

# OR using Yarn
yarn install
```

### Step 2: Start Metro Bundler

Metro is the JavaScript bundler for React Native. Start it by running:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

Leave this terminal running while developing. Metro will watch for file changes and hot-reload your app.

### Step 3: Run the Application

Open a new terminal window from the project root and run the appropriate command for your platform.

#### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

The app will build and launch on your Android Emulator or connected Android device.

#### iOS

First, install CocoaPods dependencies (required on first clone or after updating native dependencies):

```sh
# Install CocoaPods
bundle install

# Install pods
bundle exec pod install
```

Then run:

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

The app will build and launch on your iOS Simulator or connected iOS device.

## Project Structure

```
ChatApp/
├── App.tsx                 # Main application entry point
├── components/             # Reusable UI components
├── screens/                # Screen components
├── navigation/             # Navigation configuration
├── assets/                 # Images, fonts, and other static files
├── utils/                  # Utility functions and helpers
└── package.json            # Project dependencies and scripts
```

## Development

### Making Changes

1. Edit files in your text editor (e.g., `App.tsx`, components, screens)
2. Metro will automatically detect changes and hot-reload the app
3. The app updates instantly on your emulator or device

### Full Reload

To forcefully reload the app (e.g., to reset state):

- **Android**: Press <kbd>R</kbd> twice or use <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS) to open Dev Menu, then tap "Reload"
- **iOS**: Press <kbd>R</kbd> in the iOS Simulator

### Debug

Press <kbd>D</kbd> to open the debugger menu or shake your device to access developer options.

## Building for Production

### Android

```sh
npm run android -- --mode release
```

### iOS

```sh
npm run ios -- --configuration Release
```

## Troubleshooting

If you encounter issues:

1. Clear Metro bundler cache: `npm start -- --reset-cache`
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. For Android: Clear Android build cache in `android/build` directory
4. For iOS: Clean Xcode build folder and reinstall pods
5. Check the [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting)

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Native API Reference](https://reactnative.dev/docs/components-and-apis)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
