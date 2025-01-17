import dotenv from "dotenv";
dotenv.config();

import knex from "knex";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, DATABASE_URL } =
  process.env;
const port = PGPORT ? parseInt(PGPORT, 10) : undefined;

interface DbConfig {
  client: string;
  connection: {
    host: string | undefined;
    port: number | undefined;
    user: string | undefined;
    database: string | undefined;
    password: string | undefined;
    ssl: { rejectUnauthorized: boolean };
  };
}

const dbConfig: DbConfig = {
  client: "pg",
  connection: {
    host: PGHOST,
    port: port,
    user: PGUSER,
    database: PGDATABASE,
    password: PGPASSWORD,
    ssl: { rejectUnauthorized: false },
  },
};

export const db = knex(dbConfig);
