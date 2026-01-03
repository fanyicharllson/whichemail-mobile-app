/* eslint-disable import/first */
// Tests for services/secureStorage.js
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

import { secureStorage } from '../../services/secureStorage';
import * as SecureStore from 'expo-secure-store';

describe('secureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('savePassword stores a password and returns true', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValueOnce(undefined);
    const ok = await secureStorage.savePassword('svc1', 'p@ss');
    expect(ok).toBe(true);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('pwd_svc1', 'p@ss');
  });

  it('getPassword returns stored password', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('secret');
    const v = await secureStorage.getPassword('svc1');
    expect(v).toBe('secret');
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('pwd_svc1');
  });

  it('deletePassword calls delete and returns true', async () => {
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValueOnce(undefined);
    const ok = await secureStorage.deletePassword('svc2');
    expect(ok).toBe(true);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('pwd_svc2');
  });

  it('isPasswordFeatureEnabled returns true/false based on stored value', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('true');
    expect(await secureStorage.isPasswordFeatureEnabled()).toBe(true);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('false');
    expect(await secureStorage.isPasswordFeatureEnabled()).toBe(false);
  });

  it('setPasswordFeature stores the flag', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValueOnce(undefined);
    const ok = await secureStorage.setPasswordFeature(true);
    expect(ok).toBe(true);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('password_feature_enabled', 'true');
  });
});
