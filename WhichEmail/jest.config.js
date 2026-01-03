module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|expo-local-authentication|expo-secure-store|expo-modules-core|expo-router|@expo/vector-icons)/)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^expo$': '<rootDir>/__mocks__/expoMock.js',
    '^expo/(.*)$': '<rootDir>/__mocks__/expoMock.js',
    '^expo-modules-core$': '<rootDir>/__mocks__/expoMock.js',
    '^expo-router$': '<rootDir>/__mocks__/expoMock.js'
  },
  globals: {
    __DEV__: true,
  },
  // Add this to handle native modules
  setupFiles: ['<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js'],
};