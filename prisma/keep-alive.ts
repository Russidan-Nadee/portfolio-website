// prisma/keep-alive.ts
// Pings the DB so the Supabase free-tier project doesn't auto-pause from
// inactivity. Scheduled via .github/workflows/keep-db-alive.yml
// Run manually with: npx tsx prisma/keep-alive.ts
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

prisma.$queryRaw`SELECT 1`
  .then(() => {
    console.log("DB keep-alive ping OK", new Date().toISOString());
    return prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("DB keep-alive ping FAILED", err);
    await prisma.$disconnect();
    process.exit(1);
  });
