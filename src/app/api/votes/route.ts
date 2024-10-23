import { NextRequest, NextResponse } from 'next/server';
import { EventEmitter } from 'events';
import { champions } from '@/app/data/champions';
import { upvoteChampion } from '@/db';

const votesEmitter = new EventEmitter();

export async function GET(req: NextRequest) {
  const responseHeaders = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const stream = new ReadableStream({
    start(controller) {
      const sendVote = (data: { championId: number; clientId: number }) => {
        const dataStr = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(new TextEncoder().encode(dataStr));
      };

      // Subscribe to the event emitter
      votesEmitter.on('newVote', sendVote);

      // Close connection on client disconnect
      req.signal.addEventListener('abort', () => {
        votesEmitter.removeListener('newVote', sendVote);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, { headers: responseHeaders });
}

export async function POST(req: NextRequest) {
  const { championId, clientId } = await req.json();

  const champion = champions.find((item) => item.id === championId);
  if (!champion) return new NextResponse('Bad champion name', { status: 400 });

  try {
    await upvoteChampion(champion.id);
    votesEmitter.emit('newVote', { championId, clientId });
    return new NextResponse('Vote received', { status: 200 });
  } catch (e) {
    return new NextResponse('Error', { status: 500 });
  }
}
