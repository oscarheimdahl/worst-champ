// import { champions } from './app/data/champions';

// import sqlite3 from 'sqlite3';

// const db = new sqlite3.Database('index.db');
// let dbInitialized = false;

// export async function initDB() {
//   if (dbInitialized) return;
//   dbInitialized = true;

//   await createChampionsTable();
//   await seedChampions();
// }

// async function createChampionsTable() {
//   return new Promise<void>((resolve, reject) => {
//     db.run(
//       `
//       CREATE TABLE IF NOT EXISTS champions (
//         id TEXT PRIMARY KEY UNIQUE,
//         name TEXT UNIQUE,
//         votes INTEGER DEFAULT 0
//       )
//     `,
//       (err) => {
//         if (err) reject(err);
//         resolve();
//       }
//     );
//   });
// }

// async function seedChampions() {
//   const query = `
//     INSERT INTO champions (id, name, votes)
//     VALUES (?, ?, 0)
//     ON CONFLICT (id) DO NOTHING
//   `;

//   return new Promise<void>((resolve, reject) => {
//     const stmt = db.prepare(query);

//     champions.forEach((champion) => {
//       stmt.run([champion.id, champion.name], (err) => {
//         if (err) reject(err);
//       });
//     });

//     stmt.finalize((err) => {
//       if (err) reject(err);
//       resolve();
//     });
//   });
// }

// export async function getChampions() {
//   return new Promise((resolve, reject) => {
//     db.all(`SELECT * FROM champions ORDER BY votes DESC`, (err, rows) => {
//       if (err) reject(err);
//       resolve(rows);
//     });
//   });
// }

// export async function upvoteChampion(championId: string) {
//   return new Promise<void>((resolve, reject) => {
//     db.run(
//       `UPDATE champions SET votes = votes + 1 WHERE id = ?`,
//       [championId],
//       (err) => {
//         if (err) reject(err);
//         resolve();
//       }
//     );
//   });
// }

// // const client = await db.connect();

// // let dbInitialized = false;
// // export async function initDB() {
// //   if (dbInitialized) return;
// //   dbInitialized = true;

// //   await createChampionsTable();
// //   await seedChampions();
// // }

// // async function createChampionsTable() {
// //   await client.sql`
// //     CREATE TABLE IF NOT EXISTS champions (
// //       id TEXT PRIMARY KEY UNIQUE,
// //       name TEXT UNIQUE,
// //       votes INTEGER DEFAULT 0)
// //   `;
// // }

// // async function seedChampions() {
// //   const query = `
// //   INSERT INTO champions (id, name, votes)
// //   VALUES ($1, $2, 0)
// //   ON CONFLICT (id) DO NOTHING
// // `;

// //   for (const champion of champions) {
// //     sql.query(query, [champion.id, champion.name]);
// //   }
// // }

// // export async function getChampions() {
// //   const res = await client.sql`SELECT * from champions ORDER BY votes DESC`;
// //   return res.rows;
// // }

// // export async function upvoteChampion(championId: string) {
// //   return client.sql`UPDATE champions SET votes = votes + 1 WHERE id = ${championId}`;
// // }
