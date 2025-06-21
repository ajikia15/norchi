import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

// Create the database client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Create and export the drizzle instance
export const db = drizzle(client);
