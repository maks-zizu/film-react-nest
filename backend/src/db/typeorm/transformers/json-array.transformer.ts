import type { ValueTransformer } from 'typeorm';

export const jsonArrayTransformer: ValueTransformer = {
  to: (value?: string[] | null) => JSON.stringify(value ?? []),
  from: (value?: string | null) => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  },
};
