import "dotenv/config";
import { Knex } from "knex";
 const config :Knex.Config = {
 client: "sqlite3",
 connection: {
    filename: process.env.DATABASE_URL || "./db/sqlite3.database.db",
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
  debug: true,
  log: {
    warn(message) {
      console.log('[DATABASE WARNING]', message);
    },
    error(message) {
      console.log('[DATABASE ERROR]', message);
    },
    deprecate(message) {
      console.log('[DATABASE DEPRECATE]', message);
    },
    debug(message) {
      console.log('[DATABASE DEBUG]', message);
    },
  },
 }
export default config;
