import { env } from "../lib/env";

export const jobConfig = {
  connection: {
    url: env.REDIS_URL,
  },
};
