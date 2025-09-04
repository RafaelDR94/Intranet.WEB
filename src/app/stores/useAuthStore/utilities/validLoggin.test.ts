import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validLoggin } from './validLoggin';

// Helpers
type State = { hasExpired?: boolean; user?: any; offlineMode?: boolean };
type Set = (partial: Partial<State>) => void;
type Get = () => State;

// Fecha fija para evitar inconsistencias
const NOW = new Date('2025-01-01T00:00:00.000Z');

/**
 * Genera una cadena ISO sin "Z" que represente la fecha en horario local.
 * Así se alinea con la forma en que tu código hace `replace('Z','')`.
 */
function isoLocalLike(date: Date) {
  const tzAdjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return tzAdjusted.toISOString().slice(0, -1); // quita 'Z'
}

function makeStore(initial: Partial<State> = {}) {
  const state: State = { hasExpired: false, offlineMode: false, ...initial };
  const set: Set = (partial) => Object.assign(state, partial);
  const get: Get = () => state;
  return { state, set, get };
}

describe('validLoggin', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('retorna false cuando no hay usuario', async () => {
    const { set, get, state } = makeStore({ user: undefined, offlineMode: false });

    const result = await validLoggin(set as any, get as any);

    expect(result).toBe(false);
    expect(state.hasExpired).toBe(false);
  });

  it('retorna true cuando el token está vigente (futuro) y no está en offline', async () => {
    const future = new Date(NOW.getTime() + 60 * 60 * 1000); // +1h
    const { set, get, state } = makeStore({
      offlineMode: false,
      user: { lifeToken: isoLocalLike(future) },
    });

    const result = await validLoggin(set as any, get as any);

    expect(result).toBe(true);
    expect(state.hasExpired).toBe(false);
  });

  it('retorna false y marca hasExpired=true cuando el token expiró y no está en offline', async () => {
    const past = new Date(NOW.getTime() - 60 * 60 * 1000); // -1h
    const { set, get, state } = makeStore({
      offlineMode: false,
      user: { lifeToken: isoLocalLike(past) },
    });

    const result = await validLoggin(set as any, get as any);

    expect(result).toBe(false);
    expect(state.hasExpired).toBe(true);
  });

  it('retorna true si el token expiró pero offlineMode=true (no marca hasExpired)', async () => {
    const past = new Date(NOW.getTime() - 60 * 60 * 1000); // -1h
    const { set, get, state } = makeStore({
      offlineMode: true,
      user: { lifeToken: isoLocalLike(past) },
    });

    const result = await validLoggin(set as any, get as any);

    expect(result).toBe(true);
    expect(state.hasExpired).toBe(false);
  });

  it('borde: retorna false y setea hasExpired cuando currentDate === lifeTokenDate y no está en offline', async () => {
    const { set, get, state } = makeStore({
      offlineMode: false,
      user: { lifeToken: isoLocalLike(NOW) },
    });

    const result = await validLoggin(set as any, get as any);

    expect(result).toBe(false);
    expect(state.hasExpired).toBe(true);
  });

  it('borde: retorna true cuando currentDate === lifeTokenDate pero offlineMode=true', async () => {
    const { set, get, state } = makeStore({
      offlineMode: true,
      user: { lifeToken: isoLocalLike(NOW) },
    });

    const result = await validLoggin(set as any, get as any);

    expect(result).toBe(true);
    expect(state.hasExpired).toBe(false);
  });
});
