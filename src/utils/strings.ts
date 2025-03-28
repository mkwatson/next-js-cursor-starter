/**
 * Capitalizes the first letter of a string.
 *
 * @param str - The input string to capitalize
 * @returns The string with the first letter capitalized
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
} 