import { describe, it, expect, beforeEach } from 'vitest';

import {
  clearFirebaseToken,
  getDeviceId,
  saveFirebaseToken,
  readNotificationPermission,
  readFirebaseToken,
  saveNotificationPermission,
} from './AuthService';


describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('genera y guarda un deviceId si no existe', async () => {
    const id = await getDeviceId();
    expect(typeof id).toBe('string');
    expect(localStorage.getItem('deviceIdDoc')).toBe(id);
  });

  it('retorna el deviceId guardado si ya existe', async () => {
    localStorage.setItem('deviceIdDoc', 'test-id');
    const id = await getDeviceId();
    expect(id).toBe('test-id');
  });

  it('guarda y lee el firebaseToken', async () => {
    await saveFirebaseToken('abc123');
    const token = await readFirebaseToken();
    expect(token).toBe('abc123');
  });

  it('retorna null si no existe firebaseToken', async () => {
    const token = await readFirebaseToken();
    expect(token).toBe(null);
  });

  it('limpia el firebaseToken guardado', async () => {
    await saveFirebaseToken('abc123');
    await clearFirebaseToken();
    const token = await readFirebaseToken();
    expect(token).toBe(null);
  });

  it('guarda y lee el permiso de notificaciones', async () => {
    await saveNotificationPermission('granted');
    const permission = await readNotificationPermission();
    expect(permission).toBe('granted');
  });
});
