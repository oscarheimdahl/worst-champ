import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={'h-full bg-black'}>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>worstchampinthegame.com</title>
        <link rel='stylesheet' href='/styles.css' />
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
