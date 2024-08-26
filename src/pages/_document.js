import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
          }
        `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}