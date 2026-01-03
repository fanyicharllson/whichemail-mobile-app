# 📧 WhichEmail - Smart Email & Service Tracker

> **Never forget which email you used to sign up for services again!**

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=flat&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?style=flat&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Academic Information

| Field | Details |
|-------|---------|
| **Student Name** | Fanyi Charllson Fanyi |
| **Matricule** | ICTU20233841 |
| **Course Code** | CS 3410 |
| **Course Title** | Introduction to Mobile Application Development |
| **Lecturer** | Dr. Fotsing Kuetche |
| **Project Type** | Final Project & Report |
| **Semester** | Fall 2025 |
| **Institution** | THE ICT UNIVERSITY |

---

## 🎯 Project Overview

**WhichEmail** is a production-grade mobile application that solves a universal problem: **remembering which email address you used to sign up for different services**. 

### The Problem
Users often have multiple email addresses (personal, work, school) and frequently forget which one they used for specific websites and apps. This leads to:
- Failed login attempts
- Unnecessary password resets
- Account recovery frustrations
- Security concerns from using "forgot password" workflows

### The Solution
WhichEmail provides a secure, encrypted vault where users can:
- ✅ Track which email they used for each service
- ✅ Store optional passwords with biometric protection
- ✅ Quickly search and filter across all services
- ✅ Organize services by categories
- ✅ Export data for backup and portability
- ✅ Get AI-powered assistance (powered by Google Gemini)

---

## ✨ Key Features

### Core Functionality
- **📝 Service Management**: Full CRUD operations (Create, Read, Update, Delete)
- **🔍 Smart Search**: Real-time search across service names, emails, and categories
- **📂 Categories**: Pre-built categories (Social Media, Banking, Shopping, etc.) with custom icons
- **⭐ Favorites**: Quick access to frequently used services
- **🔒 Password Vault**: Encrypted password storage with biometric authentication
- **🌙 Dark Mode**: Full light/dark theme support with system preference detection

### Advanced Features
- **🤖 AI Assistant**: Gemini-powered chatbot for service recommendations and security tips
- **📊 Analytics Dashboard**: Visual insights into your service distribution
- **📤 Data Export**: Export all data to JSON format
- **🔐 Biometric Security**: Face ID / Fingerprint protection for sensitive data
- **🔄 Cloud Sync**: Real-time synchronization via Appwrite backend
- **🎨 Modern UI**: Built with NativeWind (Tailwind CSS for React Native)

### Security & Privacy
- ✅ End-to-end encryption for passwords (AES-256)
- ✅ Biometric authentication required for viewing passwords
- ✅ Local-first architecture with optional cloud sync
- ✅ No analytics or tracking
- ✅ GDPR-compliant data export

---

## 🛠️ Technology Stack

### Frontend Framework
- **React Native** (0.76.5) - Cross-platform mobile development
- **Expo** (SDK 54.0.6) - Development toolchain and managed workflow
- **TypeScript** (5.3.3) - Type-safe JavaScript

### Navigation & Routing
- **Expo Router** (4.0.14) - File-based routing system
- Stack, Tab, and Drawer navigation patterns

### UI & Styling
- **NativeWind** (4.1.23) - Tailwind CSS for React Native
- **Expo Vector Icons** - 14,000+ icons (Ionicons)
- **React Native Reanimated** (3.16.5) - Smooth animations

### State Management & Data Fetching
- **React Query** (@tanstack/react-query 5.62.12) - Server state management
- **Zustand** (4.5.5) - Client state management
- **AsyncStorage** - Local persistence

### Backend & Authentication
- **Appwrite** (16.0.2) - Backend-as-a-Service (BaaS)
  - Authentication (Email/Password, OAuth)
  - Database (NoSQL document storage)
  - Real-time subscriptions
  
### Security
- **Expo Local Authentication** (14.0.1) - Biometric APIs
- **Expo Secure Store** (14.0.0) - Encrypted key-value storage
- **react-native-encrypted-storage** (5.1.1) - Additional encryption layer

### AI Integration
- **Google Generative AI** (@google/generative-ai 0.21.0) - Gemini API integration

### Developer Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

---

## 📁 Project Structure

```
WhichEmail/
├── app/                          # Expo Router screens
│   ├── (auth)/                  # Authentication flow
│   │   ├── login.tsx           # Login screen
│   │   └── register.tsx        # Registration screen
│   ├── (tabs)/                  # Main app tabs (protected)
│   │   ├── index.tsx           # Services list (home)
│   │   ├── settings.tsx        # App settings
│   │   └── ai-assistant.tsx    # AI chatbot
│   ├── service/                 # Service-related screens
│   │   ├── add.tsx             # Add new service
│   │   ├── edit.tsx            # Edit existing service
│   │   ├── details.tsx         # Service detail view
│   │   ├── analytics.tsx       # Analytics dashboard
│   │   └── export.tsx          # Data export screen
│   ├── welcome.tsx              # Onboarding screen
│   ├── _layout.tsx              # Root layout
│   └── +not-found.tsx           # 404 screen
│
├── components/                   # Reusable UI components
│   ├── ui/                      # Core UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── ServiceCard.tsx          # Service list item
│   ├── CategoryPicker.tsx       # Category selector
│   ├── SearchBar.tsx            # Search input
│   └── EmptyState.tsx           # Empty list placeholder
│
├── services/                     # Business logic layer
│   ├── appwrite/                # Appwrite SDK integration
│   │   ├── config.ts           # Appwrite configuration
│   │   ├── auth.ts             # Authentication service
│   │   └── database.ts         # Database operations
│   ├── storage/                 # Local storage abstraction
│   │   ├── secureStorage.ts    # Encrypted storage
│   │   └── asyncStorage.ts     # General storage
│   ├── biometrics.ts            # Biometric authentication
│   └── gemini.ts                # AI assistant integration
│
├── hooks/                        # Custom React hooks
│   ├── useAppwrite.ts           # Appwrite state management
│   ├── useServices.ts           # Service CRUD operations
│   ├── useBiometrics.ts         # Biometric auth hook
│   ├── useTheme.ts              # Theme management
│   └── useAppUpdate.ts          # App update checker
│
├── store/                        # Global state (Zustand)
│   ├── authStore.ts             # Authentication state
│   ├── themeStore.ts            # Theme preferences
│   └── serviceStore.ts          # Service data cache
│
├── types/                        # TypeScript definitions
│   ├── service.ts               # Service model
│   ├── category.ts              # Category model
│   └── user.ts                  # User model
│
├── constants/                    # App-wide constants
│   ├── categories.ts            # Category definitions
│   ├── colors.ts                # Color palette
│   └── config.ts                # App configuration
│
├── utils/                        # Utility functions
│   ├── validation.ts            # Input validation
│   ├── encryption.ts            # Encryption helpers
│   └── formatting.ts            # Data formatting
│
├── assets/                       # Static assets
│   ├── images/                  # Images and graphics
│   ├── fonts/                   # Custom fonts
│   └── adaptive-icon.png        # App icon
│
├── app.json                      # Expo configuration
├── tailwind.config.js           # NativeWind configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** (optional but recommended)
  ```bash
  npm install -g expo-cli
  ```
- **Android Studio** (for Android development) or **Xcode** (for iOS development)
- **Expo Go app** (for testing on physical devices)
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/fanyicharllson/whichemail-mobile-app
   cd WhichEmail
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Appwrite Configuration
   EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id
   
   # Google Gemini API
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```
   
   Or with cache clearing (recommended after package updates):
   ```bash
   npx expo start -c
   ```

### Running on Different Platforms

#### Physical Device (Expo Go)
1. Open Expo Go app on your phone
2. Scan the QR code displayed in terminal
3. Wait for bundle to load

#### Android Simulator
```bash
npx expo start --android
```

#### iOS Simulator (macOS only)
```bash
npx expo start --ios
```

#### Web Browser
```bash
npx expo start --web
```

---

## 🏗️ Build for Production

### Android APK/AAB
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure build
eas build:configure

# Build APK (for testing)
eas build --platform android --profile preview

# Build AAB (for Google Play Store)
eas build --platform android --profile production
```

### iOS IPA
```bash
# Build for App Store
eas build --platform ios --profile production
```

### Build Profiles
Configured in `eas.json`:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Service CRUD operations
- [ ] Search and filtering
- [ ] Biometric authentication
- [ ] Dark mode switching
- [ ] Data export
- [ ] AI assistant responses

### Running Tests (if configured)
```bash
npm test
```

---

## 🎨 Design System

### Color Palette

**Light Mode:**
- Primary: Indigo (`#4F46E5`)
- Background: Slate 50 (`#F8FAFC`)
- Cards: White (`#FFFFFF`)
- Text: Slate 900 (`#0F172A`)

**Dark Mode:**
- Primary: Indigo 400 (`#818CF8`)
- Background: Slate 950 (`#020617`)
- Cards: Slate 900 (`#0F172A`)
- Text: Slate 50 (`#F8FAFC`)

### Typography
- **Headings**: System font (SF Pro / Roboto), Bold
- **Body**: System font, Regular/Medium
- **Monospace**: Used for passwords and codes

### Spacing Scale
Following Tailwind's spacing scale (4px base unit):
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px

---

## 📊 Database Schema

### Services Collection
```typescript
interface Service {
  id: string;                    // Unique identifier
  userId: string;                // Owner's user ID
  serviceName: string;           // e.g., "Netflix"
  email: string;                 // Email used for signup
  category: string;              // Category ID
  website?: string;              // Service URL
  hasPassword: boolean;          // Password storage flag
  passwordHash?: string;         // Encrypted password
  notes?: string;                // Additional notes
  isFavorite: boolean;           // Favorite flag
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

### Categories
Pre-defined categories with icons and colors:
- Social Media (💬)
- Banking (🏦)
- Shopping (🛍️)
- Entertainment (🎬)
- Productivity (📝)
- Health & Fitness (💪)
- Education (📚)
- Gaming (🎮)

---

## 🔐 Security Measures

### Data Encryption
- **Passwords**: Encrypted using AES-256 before storage
- **Secure Storage**: Leverages iOS Keychain and Android Keystore
- **Local Authentication**: Face ID / Touch ID / Fingerprint required

### Authentication Flow
1. User registers with email/password
2. Credentials hashed using bcrypt
3. JWT tokens issued for session management
4. Tokens stored in SecureStore (encrypted)
5. Biometric authentication for sensitive operations

### Best Practices Implemented
- ✅ No plaintext password storage
- ✅ HTTPS-only communication
- ✅ Input sanitization and validation
- ✅ Rate limiting on auth endpoints
- ✅ Session timeout after inactivity
- ✅ Secure random password generation

---

## 🤝 Contributing

This is an academic project, but suggestions are welcome!

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Known Issues & Future Improvements

### Current Limitations
- [ ] No offline mode (requires internet for Appwrite sync)
- [ ] Password strength indicator not implemented
- [ ] Bulk operations not supported
- [ ] No tablet/iPad optimization

### Planned Features (v2.0)
- [ ] Multi-device sync
- [ ] Browser extension for auto-capture
- [ ] Password generator with customization
- [ ] Shared family accounts
- [ ] Two-factor authentication
- [ ] Import from CSV/LastPass/1Password
- [ ] Service usage statistics
- [ ] Breach monitoring integration

---

## 📚 Learning Outcomes

This project demonstrates proficiency in:

### Technical Skills
- ✅ React Native & Expo ecosystem
- ✅ TypeScript for type-safe development
- ✅ File-based routing (Expo Router)
- ✅ State management (React Query + Zustand)
- ✅ Backend integration (Appwrite BaaS)
- ✅ Biometric authentication APIs
- ✅ Modern UI design (NativeWind/Tailwind)
- ✅ AI/ML integration (Google Gemini)

### Software Engineering Principles
- ✅ Clean architecture and separation of concerns
- ✅ Reusable component design
- ✅ Type-safe API integration
- ✅ Error handling and edge cases
- ✅ Performance optimization (React Query caching)
- ✅ Accessibility considerations
- ✅ Security best practices

### Mobile Development Concepts
- ✅ Cross-platform development
- ✅ Platform-specific features (biometrics)
- ✅ Local and cloud data persistence
- ✅ Real-time data synchronization
- ✅ Push notifications (planned)
- ✅ App distribution (Play Store/App Store)

---

## 🙏 Acknowledgments

- **Dr. Fotsing Kuetche** - Course instructor and project supervisor
- **Expo Team** - For the excellent development framework
- **Appwrite Team** - For the open-source backend platform
- **Google Gemini** - For AI capabilities
- **React Native Community** - For comprehensive documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Fanyi Charllson Fanyi**  
- Email: [fanyicharllson.fanyi@ictuniversity.edu.cm]
- GitHub: [@fanyicharllson](https://github.com/fanyicharllson)
- LinkedIn: https://www.linkedin.com/in/fanyicharllson/

---

## 📖 Additional Documentation

For more detailed documentation:
- [Architecture Overview](docs/ARCHITECTURE.md) (if exists)
- [API Documentation](docs/API.md) (if exists)
- [Deployment Guide](docs/DEPLOYMENT.md) (if exists)
- [Contributing Guidelines](CONTRIBUTING.md) (if exists)

---

**🎓 Submitted for CS 3410: Introduction to Mobile Application Development**  
**Fall 2025 | Dr. Fotsing Kuetche**

---

<div align="center">
  <p>Made with ❤️ using React Native & Expo</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>