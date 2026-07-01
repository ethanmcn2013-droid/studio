export type SimpleYamlValue = string | string[];

export function parseSimpleYaml(source: string): Record<string, SimpleYamlValue> {
  const out: Record<string, SimpleYamlValue> = {};
  let currentListKey: string | null = null;

  for (const rawLine of source.split(/\r?\n/)) {
    const withoutComment = rawLine.replace(/\s+#.*$/, "");
    if (!withoutComment.trim()) continue;

    const keyMatch = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(withoutComment);
    if (keyMatch) {
      const [, key, rawValue = ""] = keyMatch;
      const value = cleanScalar(rawValue);
      if (value) {
        out[key] = value;
        currentListKey = null;
      } else {
        out[key] = [];
        currentListKey = key;
      }
      continue;
    }

    const itemMatch = /^\s*-\s*(.*)$/.exec(withoutComment);
    if (itemMatch && currentListKey) {
      const existing = out[currentListKey];
      if (!Array.isArray(existing)) {
        throw new Error(`YAML key ${currentListKey} is not a list.`);
      }
      existing.push(cleanScalar(itemMatch[1]));
      continue;
    }

    throw new Error(`Unsupported YAML line: ${rawLine}`);
  }

  return out;
}

function cleanScalar(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}
