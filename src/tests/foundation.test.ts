import { describe, expect, it } from 'vitest';
import { fixtures, parseFixtures } from '../data/fixtures';
import { createRepository, decode } from '../data/repository';
describe('fundament', () => {
  it('wczytuje i waliduje katalog', () => { expect(fixtures.boxes).toHaveLength(3); expect(() => parseFixtures({})).toThrow(); });
  it('odrzuca uszkodzony zapis', () => { expect(decode('{bad')).toBeNull(); expect(decode('{"version":9}')).toBeNull(); });
  it('obsługuje brak storage', () => { const repo = createRepository(() => { throw Error('blocked'); }); expect(repo.read()).toBeNull(); expect(repo.sessionOnly).toBe(true); });
});
