const PREFIX = "ninja-premium-cookbook:v26:";

export function readStorage(key, fallback) {
  try {
    const rawValue = localStorage.getItem(`${PREFIX}${key}`);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
}

export function removeStorage(key) {
  localStorage.removeItem(`${PREFIX}${key}`);
}
