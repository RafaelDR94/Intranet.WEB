import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getDeviceId,
  saveFirebaseToken,
  readFirebaseToken,
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
});