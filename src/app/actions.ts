'use server';

import { champions } from './data/champions';
import { db } from '../db';

export async function upvoteChampion(championId: string) {
  const champion = champions.find((item) => item.id === championId);
  if (!champion) return false;

  let ok = true;

  db.run(
    `
      UPDATE champions
      SET votes = votes + 1
      WHERE id = '${champion.id}'
      `,
    [],
    (err) => {
      if (err) ok = false;
    }
  );

  return ok;
}
