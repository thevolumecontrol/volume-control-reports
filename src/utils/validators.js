export function isEmail(value) {
  if (!value) return false;
  const v = String(value).trim();
  // basic allowed chars + presence of @ and a TLD
  const re = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
  return re.test(v);
}

export function isNotEmpty(value) {
  return value != null && String(value).trim() !== "";
}