import { clsx, type ClassValue } from "clsx";
import { createId } from "@paralleldrive/cuid2";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cuid() {
  return createId();
}
