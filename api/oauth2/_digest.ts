import { createHash } from "crypto";

export function parseAuthenticateHeader(
  authenticateHeader: string
): Map<string, string> {
  const map = new Map<string, string>();

  const regex = /(?<key>[^=\s]+)="(?<value>[^"]+)"/gs;

  let match = regex.exec(authenticateHeader);
  while (match && match.groups) {
    map.set(match.groups["key"], match.groups["value"]);
    match = regex.exec(authenticateHeader);
  }

  return map;
}

export function calculateDigest({
  clientid,
  clientSecret,
  verb,
  path,
  realm,
  nonce
}: {
  clientid: string;
  clientSecret: string;
  verb: string;
  path: string;
  realm: string;
  nonce: string;
}): string {
  const hash1 = createHash("md5")
    .update(`${clientid}:${realm}:${clientSecret}`)
    .digest("hex");
  const hash2 = createHash("md5")
    .update(`${verb}:${path}`)
    .digest("hex");
  return createHash("md5")
    .update(`${hash1}:${nonce}:${hash2}`)
    .digest("hex");
}

export function digestHeader({
  path,
  clientid,
  realm,
  nonce,
  digest
}: {
  path: string;
  clientid: string;
  realm: string;
  nonce: string;
  digest: string;
}): string {
  return `Digest username="${clientid}", realm="${realm}", nonce="${nonce}", uri="${path}", response="${digest}"`;
}
