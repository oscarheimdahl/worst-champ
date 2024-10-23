import { champions } from './app/data/champions';
import { db, sql } from '@vercel/postgres';

const client = await db.connect();

let dbInitialized = false;
export async function initDB() {
  if (dbInitialized) return;
  dbInitialized = true;

  await createChampionsTable();
  await seedChampions();
}

async function createChampionsTable() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS champions (
      id TEXT PRIMARY KEY UNIQUE, 
      name TEXT UNIQUE, 
      votes INTEGER DEFAULT 0)
  `;
}

async function seedChampions() {
  const query = `
  INSERT INTO champions (id, name, votes)
  VALUES ($1, $2, 0)
  ON CONFLICT (id) DO NOTHING
`;

  for (const champion of champions) {
    sql.query(query, [champion.id, champion.name]);
  }
}

export async function getChampions() {
  const res =
    await client.sql`SELECT * from champions ORDER BY votes DESC, name ASC`;
  return res.rows;
}

export async function upvoteChampion(championId: string) {
  return client.sql`UPDATE champions SET votes = votes + 1 WHERE id = ${championId}`;
}
