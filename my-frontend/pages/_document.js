import Document, { Html, Head, Main, NextScript } from 'next/document';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { assetPrefix } = publicRuntimeConfig;

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href={`${assetPrefix}/manifest.json`} />
          <link rel="icon" href={`${assetPrefix}/icons/augmego-icon.webp`} />
          <link rel="apple-touch-icon" href={`${assetPrefix}/icons/augmego-icon.webp`} />
          <meta name="theme-color" content="#000000" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
