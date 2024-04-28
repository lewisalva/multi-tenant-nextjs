import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  strict: false,
  verbose: false,
  tablesFilter: ["multi-tenant-nextjs_*"],
  out: './drizzle',
} satisfies Config;
