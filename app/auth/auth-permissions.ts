export const resources = ["notes"] as const;
export const actions = ["create", "read", "update", "delete"] as const;
export const accesses = ["own", "any"] as const;
export const roles = ["admin", "user"] as const;

export type Resource = (typeof resources)[number];
export type Action = (typeof actions)[number];
export type Access = (typeof accesses)[number];
export type Role = (typeof roles)[number];

export type Permission = `${Resource}:${Action}:${Access}`;
