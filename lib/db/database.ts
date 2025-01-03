import { DB } from "./schema";
import { Pool } from "pg";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";

function dialectFromDatabaseUrl() {
  const url = new URL(process.env.DATABASE_URL!);
  return new PostgresDialect({
    pool: new Pool({
      database: url.pathname.slice(1),
      host: url.hostname,
      user: url.username,
      password: url.password,
      port: Number(url.port),
      max: 10,
    }),
  });
}

const dialect = dialectFromDatabaseUrl();

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
  plugins: [new CamelCasePlugin()],
});
