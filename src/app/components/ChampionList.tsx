'use client';
import { toast } from 'sonner';
import { Reorder } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Champion } from '../page';
import { ChampionButton } from './ChampionButton';
import { upvoteChampion } from '../api/api';
import { socketUrl } from '../utils/env';

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
    const socket = new WebSocket(socketUrl);

    socket.onmessage = async (event) => {
      if (event.type === 'message') {
        const data = JSON.parse(event.data);
        if (data.type === 'vote') {
          if (data.clientId === clientId.current) return;
          await upvote(data.championId);
        }
      }
    };
    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      socket.close();
    };
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
      await upvoteChampion(championId, clientId.current);
    } catch (e) {
      customToast('Server Error');
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
                  'pointer-events-none select-none size-full transition-transform scale-[1.05]'
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

function customToast(message: string) {
  toast.custom(() => (
    <div className='flex text-white rounded-md w-[354px] p-[1px] bg-white right-0 bg-gradient-to-tr from-[hsl(295,67%,10%)] to-[hsl(30,21%,20%)]'>
      <div className='size-full p-4 rounded-[5px] bg-[#030312]'>
        <h1>{message}</h1>
      </div>
    </div>
  ));
}
