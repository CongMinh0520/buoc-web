import type { Locale } from "../config";
import { en } from "./en";
import { vi, type Dictionary } from "./vi";

export type { Dictionary };
export const dictionaries: Record<Locale, Dictionary> = { vi, en };
