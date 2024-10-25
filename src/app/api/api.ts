'use server';

import { env } from 'process';
import { apiUrl } from '../utils/env';

export async function getChampions() {
  const res = await fetch(`${apiUrl}/champions`);
  return res.json();
}

export async function upvoteChampion(championId: string, clientId: string) {
  const res = await fetch(`${apiUrl}/champions/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ championId, clientId }),
  });

  if (res.status !== 200) throw new Error('Error');
}
