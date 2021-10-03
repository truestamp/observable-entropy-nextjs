// Copyright © 2020-2021 Truestamp Inc. All rights reserved.

import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import useSWR from 'swr'
const { DateTime } = require("luxon");

import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { ClockIcon, AtSymbolIcon } from '@heroicons/react/solid'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useEntropy() {
  const { data, error } = useSWR(`https://entropy.truestamp.com/latest`, fetcher, { refreshInterval: 15000 })

  return {
    entropy: data,
    isLoading: !error && !data,
    isError: error
  }
}

export default function App({ }) {
  const [dateState, setDateState] = useState();
  const { entropy, isLoading, isError } = useEntropy()

  useEffect(() => {
    const interval = setInterval(() => {
      setDateState(DateTime.now())
    }, 450);
    return () => clearInterval(interval)
  }, []);

  function hashColor() {
    if (isError) {
      return 'text-red-500 dark:text-red-500'
    } else if (isLoading) {
      return 'text-gray-500 dark:text-gray-500'
    } else if (entropy) {
      return 'text-green-500 dark:text-green-500'
    } else {
      return 'text-gray-100 dark:text-gray-100'
    }
  }

  function displayCreatedAt() {
    if (!entropy || !entropy.createdAt) return ''

    const createdAt = DateTime.fromISO(entropy.createdAt)
    return createdAt.toUTC().toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
  }

  function displayCreatedAtDiff() {
    if (!entropy || !entropy.createdAt) return ''

    const createdAt = DateTime.fromISO(entropy.createdAt)
    const diff = DateTime.now().toUTC().diff(createdAt, ['minutes', 'seconds'])
    return `${diff.minutes}m ${Math.floor(diff.seconds)}s`
  }

  return (
    <body className="flex flex-col min-h-screen bg-white dark:bg-gray-800">
      <Head>
        <title>Truestamp | Observable Entropy</title>

        <meta name="description" content="Truestamp Observable Entropy captures and store public sources of entropy and generates incontestable public randomness that is independently verifiable." />
        <meta name="robots" content="index,follow" />
        <meta name="author" content="Truestamp" />

        {/* http://humanstxt.org */}
        <link type="text/plain" rel="author" href="/humans.txt" />

        {/*
        Favicon
        https://realfavicongenerator.net/
        https://realfavicongenerator.net/favicon_result?file_id=p1eg3vq3c81jko89la8cbpn1b3d6
        Check your favicon with the [favicon checker](https://realfavicongenerator.net/favicon_checker)
        */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" crossOrigin="use-credentials" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1059a9" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content="Truestamp" />
        <meta name="application-name" content="Truestamp" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <main className="flex-auto h-40">
        <div className="flex flex-col min-h-screen items-center justify-center font-mono">
          {entropy && <>
            <p className={"w-5/6 md:w-full text-center text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl break-words md:break-normal mb-10 font-bold" + hashColor()}>{entropy && entropy.hash}</p>

            <p className="text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl text-center text-gray-600 dark:text-gray-400 mb-5"><AtSymbolIcon className="mr-2 h-5 md:h-7 lg:h-8 w-5 md:w-7 lg:w-8 text-blue-500 inline-block" />{displayCreatedAt()}<span className="inline sm:hidden"><br /></span><span className="hidden sm:inline"> &mdash; </span>{displayCreatedAtDiff()} ago</p>

            <p className="text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl mb-5 text-gray-600 dark:text-gray-400">
              <ClockIcon className="mr-2 h-5 md:h-7 lg:h-8 w-5 md:w-7 lg:w-8 text-blue-500 inline-block" />{dateState && dateState.toUTC().toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}
            </p>
          </>
          }
          {!entropy && <>
            <p className={"w-5/6 md:w-full text-center text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl break-words md:break-normal mb-10 font-bold text-gray-500"}>loading...</p>
          </>
          }
        </div>
      </main>

      <footer className="h-10 sm:h-15 mb-10 sm:mb-15">
        <p className="text-sm text-center font-light text-gray-500 dark:text-gray-500">The <Link href="https://github.com/truestamp/observable-entropy/blob/main/README.md" ><a className="text-blue-600 hover:text-blue-600">Observable Entropy</a></Link> project<span className="inline sm:hidden"><br /></span><span className="hidden sm:inline">, </span>&copy; 2021 <Link href="https://www.truestamp.com"><a className="text-blue-600 hover:text-blue-600">Truestamp Inc.</a></Link></p>
      </footer>

      <Script
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "e045c587d3224c8a8e309f607ee65a0d"}'
      />
    </body >
  )
}
