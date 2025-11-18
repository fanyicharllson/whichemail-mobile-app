/* eslint-disable import/first */
import { authenticateUser, isAuthenticationAvailable, getAuthenticationTypeName } from '../../utils/authUtils';

// Mock expo-local-authentication
jest.mock('expo-local-authentication', () => {
  const AuthenticationType = {
    FACIAL_RECOGNITION: 1,
    FINGERPRINT: 2,
    IRIS: 3,
  };

  return {
    hasHardwareAsync: jest.fn(),
    isEnrolledAsync: jest.fn(),
    supportedAuthenticationTypesAsync: jest.fn(),
    authenticateAsync: jest.fn(),
    AuthenticationType,
  };
});

jest.mock('@/utils/toast', () => ({
  showToast: { success: jest.fn(), error: jest.fn() }
}));

import * as LocalAuthentication from 'expo-local-authentication';
import { showToast } from '@/utils/toast';
import { Alert } from 'react-native';

describe('authUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns not-available when device has no hardware', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValueOnce(false);

    const res = await authenticateUser();

    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Device does not support/);
    expect(res.authType).toBe('none');
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('returns not-enrolled when no auth enrolled', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValueOnce(true);
    (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValueOnce(false);

    const res = await authenticateUser({ purpose: 'access-settings' });

    expect(res.success).toBe(false);
    expect(res.error).toMatch(/No authentication method enrolled/);
    expect(res.authType).toBe('none');
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('authenticates successfully using biometric and shows success toast', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValueOnce(true);
    (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValueOnce(true);
    (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValueOnce([
      LocalAuthentication.AuthenticationType.FINGERPRINT,
    ]);
    (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValueOnce({ success: true });

    const res = await authenticateUser({ showSuccessToast: true, successMessage: 'OK' });

    expect(res.success).toBe(true);
    expect(res.authType).toBe('biometric');
    expect(showToast.success).toHaveBeenCalledWith('Authenticated ✓', 'OK');
  });

  it('returns failure when authentication canceled/failed', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValueOnce(true);
    (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValueOnce(true);
    (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValueOnce([]);
    (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValueOnce({ success: false });

    const res = await authenticateUser({ purpose: 'copy-password' });

    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Authentication failed or cancelled/);
  });

  it('isAuthenticationAvailable returns true when compatible and enrolled', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValueOnce(true);
    (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValueOnce(true);

    const ok = await isAuthenticationAvailable();
    expect(ok).toBe(true);
  });

  it('getAuthenticationTypeName returns readable name', async () => {
    (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValueOnce([
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
    ]);

    const name = await getAuthenticationTypeName();
    expect(name).toBe('Face ID');
  });
});
