import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

// Create the database client with performance optimizations
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:./local.db",
  authToken: process.env.TURSO_AUTH_TOKEN, // Optional for local file
  // Connection pooling and performance settings
  syncUrl: process.env.TURSO_SYNC_URL,
  encryptionKey: process.env.TURSO_ENCRYPTION_KEY,
  // Performance optimizations
  intMode: "number",
});

// Create and export the drizzle instance with performance settings
export const db = drizzle(client, {
  logger: process.env.NODE_ENV === "development",
});
