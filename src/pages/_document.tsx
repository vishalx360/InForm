import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta name="description" content="Manage Forms" />
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#297B7A" />
                <meta property="og:image" content="https://inform-app.vercel.app/poster.jpg" />

            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}