export function save(key: string, data: unknown): void {
  if (data) {
    window.localStorage.setItem(key, JSON.stringify(data));
  } else {
    window.localStorage.removeItem(key);
  }
}

export function load<T>(key: string, defaultValue: T): T {
  const value = window.localStorage.getItem(key);
  if (!value) {
    return defaultValue;
  }
  return JSON.parse(value);
}
