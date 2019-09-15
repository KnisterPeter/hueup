export function isObject(obj: unknown): obj is {} {
  return Boolean(typeof obj === "object" && obj);
}

export function isNumber(n: unknown): n is number {
  return typeof n === "number";
}

export function isString(n: unknown): n is string {
  return typeof n === "string";
}

export function isBoolean(n: unknown): n is boolean {
  return typeof n === "boolean";
}

export function hasAttribute<T, K extends PropertyKey>(
  o: T,
  k: K
): o is T & { [_ in K]: unknown } {
  return isObject(o) && k in o;
}

export function hasStringAttribute<T, K extends PropertyKey>(
  o: T,
  k: K
): o is T & { [_ in K]: string } {
  return hasAttribute(o, k) && isString(o[k]);
}

export function hasBooleanAttribute<T, K extends PropertyKey>(
  o: T,
  k: K
): o is T & { [_ in K]: boolean } {
  return hasAttribute(o, k) && isBoolean(o[k]);
}

export function hasNumberAttribute<T, K extends PropertyKey>(
  o: T,
  k: K
): o is T & { [_ in K]: number } {
  return hasAttribute(o, k) && isNumber(o[k]);
}

export function hasObjectAttribute<T, K extends PropertyKey>(
  o: T,
  k: K
): o is T & { [_ in K]: {} } {
  return hasAttribute(o, k) && isObject(o[k]);
}
