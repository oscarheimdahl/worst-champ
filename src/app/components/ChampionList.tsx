'use client';

import { ChampionButton } from './ChampionButton';
import { useState } from 'react';
import { Reorder } from 'framer-motion';
import { Champion } from '../page';
import { upvoteChampionAction } from '../actions';
import { cn } from '../utils/utils';

function sortChampions(a: Champion, b: Champion) {
  if (b.votes === a.votes) {
    return a.name.localeCompare(b.name); // Sort alphabetically if votes are equal
  }
  return b.votes - a.votes;
}

export const ChampionList = ({
  initialChampions,
}: {
  initialChampions: Champion[];
}) => {
  const [preventVoteClick, setPreventVoteClick] = useState(false);
  const [champions, setChampions] = useState(
    initialChampions.toSorted(sortChampions)
  );

  const upvote = async (champion: Champion) => {
    let newChampions: Champion[] = [];
    setChampions((prev) => {
      const _newChampions = prev
        .map((item) => {
          if (item.id === champion.id) {
            return {
              ...item,
              votes: item.votes + 1,
            };
          }
          return item;
        })
        .toSorted(sortChampions);
      newChampions = _newChampions;
      return _newChampions;
    });

    const orderChanged = !newChampions.every(
      (champion, i) => champions[i].id === champion.id
    );

    if (orderChanged) {
      setPreventVoteClick(true);
      setTimeout(() => {
        setPreventVoteClick(false);
      }, 800);
    }

    const ok = await upvoteChampionAction(champion.id);
    if (!ok) alert('Error');
  };

  return (
    <Reorder.Group
      className={cn(
        'items-center relative w-full gap-6 py-[300px] flex flex-col',
        preventVoteClick && 'pointer-events-none'
      )}
      as='div'
      axis='y'
      values={champions}
      onReorder={(c) => setChampions(c)}
    >
      {champions.map((champion) => {
        return (
          <Reorder.Item
            drag={false}
            key={champion.id}
            value={champion}
            as='div'
            className={
              'group relative has-[~div:hover]:opacity-30 peer peer-hover:opacity-30 transition-opacity duration-1000'
            }
          >
            <span className={'absolute pointer-events-none sr-only'}>
              {champion.name.replace('_', ' ')}
            </span>
            <ChampionButton onClick={() => upvote(champion)}>
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
  );
};
