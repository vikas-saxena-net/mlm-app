// Standard Indian PAN format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).
const panFormatRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export function isValidPanNumber(value: string): boolean {
  return panFormatRegex.test(value.trim().toUpperCase());
}
