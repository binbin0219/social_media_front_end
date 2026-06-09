export function generateCurrentTime() : number {
    const timestamp = new Date().getTime();
    return timestamp;
}

export function mergeByKey<T>(
  existing: T[],
  incoming: T[],
  key: keyof T
): T[] {
  const existingKeys = new Set(existing.map(item => item[key]));

  const newItems = incoming.filter(
    item => !existingKeys.has(item[key])
  );

  return [...existing, ...newItems];
}