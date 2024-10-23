'use client';

import { Reorder } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Champion } from '../page';
import { ChampionButton } from './ChampionButton';

function sortChampions(a: Champion, b: Champion) {
  if (b.votes === a.votes) {
    return a.name.localeCompare(b.name);
  }
  return b.votes - a.votes;
}

export const ChampionList = ({
  initialChampions,
}: {
  initialChampions: Champion[];
}) => {
  const clientId = useRef(Math.random().toString(36).substring(2, 15));
  const [preventVoteClick, setPreventVoteClick] = useState(false);
  const [champions, setChampions] = useState(
    initialChampions.toSorted(sortChampions)
  );

  useEffect(() => {
    const eventSource = new EventSource('api/votes'); // Subscribe to the SSE endpoint
    eventSource.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.clientId === clientId.current) return;
      await upvote(data.championId);
    };
    return () => eventSource.close();
  }, []);

  const upvote = async (championId: string, castByUser?: boolean) => {
    setChampions((prevChampions) => {
      const newChampions = prevChampions
        .map((item) => {
          if (item.id === championId) {
            return {
              ...item,
              votes: item.votes + 1,
            };
          }
          return item;
        })
        .slice()
        .sort(sortChampions);
      return newChampions;
    });

    // const orderChanged = !newChampions.every(
    //   (champion, i) => champions[i].id === champion.id
    // );

    // if (orderChanged) {
    //   setPreventVoteClick(true);
    //   setTimeout(() => {
    //     setPreventVoteClick(false);
    //   }, 800);
    // }

    if (!castByUser) return;

    try {
      await fetch('/api/votes', {
        method: 'POST',
        body: JSON.stringify({ championId, clientId: clientId.current }),
      });
    } catch (e) {
      alert('Error');
    }
  };

  return (
    <Reorder.Group
      className={'items-center relative w-full gap-6 py-[300px] flex flex-col'}
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
            style={{ zIndex: champion.votes }}
            className={
              'group relative has-[~div:hover]:opacity-30 peer peer-hover:opacity-30 transition-opacity duration-1000'
            }
          >
            <span className={'absolute pointer-events-none sr-only'}>
              {champion.name.replace('_', ' ')}
            </span>
            <ChampionButton
              className={preventVoteClick ? 'pointer-events-none' : ''}
              onClick={() => upvote(champion.id, true)}
            >
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
