import _sqlite3 from 'sqlite3';
import { champions } from './app/data/champions';

const sqlite3 = _sqlite3.verbose();

export const db = new sqlite3.Database('index.db');

let dbInitialized = false;
export async function initDB() {
  if (dbInitialized) return;

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS champions (
        id TEXT PRIMARY KEY UNIQUE, 
        name TEXT UNIQUE, 
        votes INTEGER DEFAULT 0)`);

    const insertChampion = db.prepare(
      'INSERT OR IGNORE INTO champions (id, name, votes) VALUES (?, ?, 0)'
    );

    champions.forEach((champion) => {
      insertChampion.run([champion.id, champion.name], (err) => {
        if (err) throw new Error(err.message);
      });
    });

    insertChampion.finalize((err) => {
      if (err) throw new Error(err.message);
    });
  });
  dbInitialized = true;
}

export async function getChampions() {
  return new Promise((resolve, reject) => {
    db.all(
      `
        SELECT * FROM champions
        ORDER BY votes DESC
        `,
      [],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
}
