'use server';

import { champions } from './data/champions';
import { upvoteChampion } from '../db';

export async function _upvoteChampionAction(championId: string) {
  const champion = champions.find((item) => item.id === championId);
  if (!champion) return false;

  try {
    await upvoteChampion(champion.id);
    return true;
  } catch (e) {
    return false;
  }
}
