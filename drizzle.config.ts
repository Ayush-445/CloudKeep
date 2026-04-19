import * as dotenv from 'dotenv';
// import { defineConfig } from 'drizzle-kit';

dotenv.config();

if(!process.env.DATABASE_URL) {
    throw new Error('DATABASE url is not defined');
}

export default ({
  out: './drizzle',
  schema: './src/lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: "__drizzle_migrations",
    schema: "public"
  },
  verbose: true,
  strict: true,

});
