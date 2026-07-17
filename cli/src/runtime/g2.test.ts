import { describe, it, expect } from 'vitest';
import { stateActionKey } from './types.js';

describe('stateActionKey', () => {
  it('produces the same key for the same state and action', () => {
    const k1 = stateActionKey({ id: 's0' }, { id: 'a0' });
    const k2 = stateActionKey({ id: 's0' }, { id: 'a0' });
    expect(k1).toBe(k2);
  });

  it('produces different keys for different actions on the same state', () => {
    const k1 = stateActionKey({ id: 's0' }, { id: 'a0' });
    const k2 = stateActionKey({ id: 's0' }, { id: 'a1' });
    expect(k1).not.toBe(k2);
  });

  it('produces different keys for different states with the same action', () => {
    const k1 = stateActionKey({ id: 's0' }, { id: 'a0' });
    const k2 = stateActionKey({ id: 's1' }, { id: 'a0' });
    expect(k1).not.toBe(k2);
  });
});
