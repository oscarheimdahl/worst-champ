import { initDB } from '@/db';
import './globals.css';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    initDB();
  } catch (e) {
    console.log(`🔴 Unable to init DB`);
  }

  return (
    <html className={'h-full bg-black'}>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>worstchampinthegame.com</title>
      </head>
      <body
        className='h-full overflow-hidden'
        style={{ overscrollBehaviorY: 'none' }}
      >
        {children}
      </body>
    </html>
  );
}
