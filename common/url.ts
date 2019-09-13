function param(key: string, value: string | string[]): string {
  if (Array.isArray(value)) {
    return value.map(value => param(key, value)).join("&");
  }
  return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
}

export function objectToUrl(params: {
  [key: string]: string | string[];
}): string {
  return Object.entries(params)
    .map(([key, value]) => param(key, value))
    .join("&");
}

export function urlToObject(
  url: string
): {
  [key: string]: string;
} {
  return url
    .slice(1)
    .split("&")
    .map(kv => kv.split("="))
    .reduce(
      (params, kv) => ({
        ...params,
        [decodeURIComponent(kv[0])]: decodeURIComponent(kv[1])
      }),
      {}
    );
}
