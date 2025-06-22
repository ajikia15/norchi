import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

// Create the database client with fallback for development
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:./local.db",
  authToken: process.env.TURSO_AUTH_TOKEN, // Optional for local file
});

// Create and export the drizzle instance
export const db = drizzle(client);
