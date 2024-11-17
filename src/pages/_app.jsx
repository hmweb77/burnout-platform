"use client"
import Head from 'next/head';
import "../app/globals.css";
import Navbar from '@/components/Home/Navbar';




function MyApp({ Component, pageProps }) {
  return (
    <>
    
    <Head> 
        <title>Burnout Insights - Understand Your Well-being</title>
        <meta name="description" content="Take our free survey to identify areas of improvement in your emotions, mindset, lifestyle, and work environment." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Component {...pageProps} />

    </>
  );
}

export default MyApp;
