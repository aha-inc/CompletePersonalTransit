// Sprint 2/5: Validate AI output against calm/plain-language tone standard (EU-03)

const BANNED_PATTERNS = [
  /warning:/i,
  /alert!/i,
  /connection approaching/i,
  /accessibility (mode|constraints) (enabled|applied)/i,
  /\d+ routes? found/i,
  /transfer window:\s*\d/i,
  /elevator status: ok/i,
];

export type ToneValidationResult = {
  valid: boolean;
  violations: string[];
};

export function validateTone(text: string): ToneValidationResult {
  const violations = BANNED_PATTERNS
    .filter((pattern) => pattern.test(text))
    .map((p) => p.source);

  return { valid: violations.length === 0, violations };
}

export function assertTone(text: string, context: string): void {
  const result = validateTone(text);
  if (!result.valid) {
    console.warn(
      JSON.stringify({
        event: "tone_violation",
        context,
        violations: result.violations,
        text: text.slice(0, 200),
      })
    );
  }
}
