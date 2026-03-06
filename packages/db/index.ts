// packages/db/index.ts
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';
import path from 'path';

config({
  path: path.resolve(__dirname, '.env'),  // looks in same folder as index.ts
  debug: true,
});

console.log("DB env loaded:", process.env.DATABASE_URL);

// const connectionString = "postgresql://postgres:mysecretpassword@localhost:5432/postgres?schema=public";
// console.log("Using hardcoded connection:", connectionString);
const connectionString = process.env.DATABASE_URL;
console.log("Using hardcoded connection:", connectionString);
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Make sure .env is loaded in the entry point (apps/backend/index.ts)"
  );
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prismaClient = new PrismaClient({
  adapter,   // ← this is required in Prisma 7+
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
});