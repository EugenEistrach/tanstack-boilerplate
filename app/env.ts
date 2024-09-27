import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

// TODO: figure out proper way to support also client envs
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
