# WhichEmail - Final Project Submission

**Student Name:** [Your FirstName LastName]  
**Course:** [Your Course]  
**Project Title:** WhichEmail - Password Manager Mobile Application

---

## 📦 Submission Contents

This repository contains:
- ✅ **WhichEmail/** - Full project source code
- ✅ **screenshots/** - App screenshots and screen recordings
- ✅ **project_report/** - PDF project report
- ✅ **APK file** - Ready-to-install Android application

---

## 🚀 Build & Run Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Android Studio (for Android builds)
- Expo CLI

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd whichemail
   ```

2. **Navigate to project directory**
   ```bash
   cd WhichEmail
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update with your Appwrite credentials:
     ```
     cp .env.example .env
     ```
   - Edit `.env` with your actual API keys

5. **Run the development server**
   ```bash
   npx expo start
   ```

6. **Run on Android**
   ```bash
   npx expo run:android
   ```

### Building APK

To build a production APK:
```bash
npx expo build:android
# or using EAS
eas build --platform android
```

---

## 📱 Installing the APK

1. Transfer the APK file to your Android device
2. Enable "Install from Unknown Sources" in device settings
3. Open the APK file and follow installation prompts

---

## 🔒 Security Note

**API Keys:** The `.env` file is excluded from git for security. Use the provided `.env.example` as a template. After grading, all API keys will be rotated in the Appwrite dashboard.

---

## 📂 Project Structure

```
WhichEmail/
├── app/              # App screens and routes
├── components/       # Reusable UI components
├── services/         # Appwrite and API services
├── utils/           # Utility functions
├── constants/       # App constants
├── hooks/           # Custom React hooks
└── assets/          # Images and static files
```

---

## 🛠️ Technologies Used

- **Framework:** React Native + Expo
- **Routing:** Expo Router
- **Styling:** NativeWind (Tailwind CSS)
- **Backend:** Appwrite
- **Language:** TypeScript
- **State Management:** React Query

---

## 📧 Contact

For any questions regarding this submission, please contact:
- **Email:** [Your Email]
- **Submission Date:** January 2026

---

## 📄 License

This project is submitted as part of academic coursework.
