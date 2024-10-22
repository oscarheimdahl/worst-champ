'use client';

import { champions as _champions } from '@/app/data/champions';
import { ChampionButton } from './ChampionButton';
import { useEffect, useState } from 'react';
import { Reorder } from 'framer-motion';

function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const ChampionList = () => {
  const [champions, setChampions] = useState(_champions);

  useEffect(() => {
    setInterval(() => {
      setChampions((prev) => [...shuffleArray(prev)]);
    }, 10000);
  }, []);

  return (
    <Reorder.Group
      className={'items-center relative w-full gap-6 py-12 flex flex-col'}
      as='div'
      axis='y'
      values={champions}
      onReorder={setChampions}
    >
      {champions.map((champion) => {
        return (
          <Reorder.Item
            drag={false}
            key={champion.id}
            value={champion}
            as='div'
            className={
              'group relative has-[~div:hover]:opacity-30 peer peer-hover:opacity-30 transition-opacity'
            }
          >
            <span className={'absolute pointer-events-none sr-only'}>
              {champion.name.replace('_', ' ')}
            </span>
            <ChampionButton>
              <img
                className={
                  'pointer-events-none select-none size-full transition-transform scale-110'
                }
                src={`/imgs/${champion.name}.jpg`}
              />
            </ChampionButton>
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
    // </div>
  );
};
