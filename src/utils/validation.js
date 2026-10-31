// Simple, permissive email check used by the newsletter and contact forms
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value || '').trim())
}
