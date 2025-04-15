
// NOTE: This file cannot be used directly in the browser.
// It's meant to be used in a Node.js environment (like a backend API).
// For frontend development, we'll use mock data instead.
import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

if (!import.meta.env.VITE_MONGODB_URI) {
  console.error('Please define the VITE_MONGODB_URI environment variable');
}

export async function connectToDatabase() {
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // If no connection, create a new one
  const client = new MongoClient(import.meta.env.VITE_MONGODB_URI as string);
  await client.connect();
  const db = client.db(import.meta.env.VITE_MONGODB_DB_NAME || 'lyzLawFirm');

  // Cache the client and db connection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// NOTE: In a real app, this would be part of a backend API, not directly in the frontend
