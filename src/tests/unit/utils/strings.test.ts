import { describe, it, expect } from 'vitest';

import { capitalize } from '../../../utils/strings';

describe('Utils: String functions', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should return empty string when given empty input', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should handle single character strings', () => {
      expect(capitalize('a')).toBe('A');
    });
  });
}); 