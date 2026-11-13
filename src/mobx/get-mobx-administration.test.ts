import { observable } from 'mobx';
import { describe, expect, it } from 'vitest';
import { getMobxAdministration } from './get-mobx-administration.js';

describe('getMobxAdministration', () => {
  it('returns the administration object for an observable', () => {
    const obj = observable({ count: 0 });
    const admin = getMobxAdministration(obj);
    expect(admin).toBeDefined();
    expect(typeof admin).toBe('object');
  });

  it('returns an object with name_ property', () => {
    const obj = observable({ count: 0 });
    const admin = getMobxAdministration(obj);
    expect(admin).toHaveProperty('name_');
  });

  it('returns undefined for a plain object', () => {
    const obj = { count: 0 };
    const admin = getMobxAdministration(obj);
    expect(admin).toBeUndefined();
  });

  it('returns different administration for different observables', () => {
    const obj1 = observable({ count: 0 });
    const obj2 = observable({ count: 0 });
    const admin1 = getMobxAdministration(obj1);
    const admin2 = getMobxAdministration(obj2);
    expect(admin1).not.toBe(admin2);
  });
});
