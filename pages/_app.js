// Copyright © 2020-2021 Truestamp Inc. All rights reserved.

import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import useSWR from 'swr'
const { DateTime } = require("luxon");

import 'tailwindcss/tailwind.css'
import '../styles/globals.css'

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
  const [dateStateUTC, setDateStateUTC] = useState();
  const { entropy, isLoading, isError } = useEntropy()

  useEffect(() => {
    const interval = setInterval(() => {
      setDateStateUTC(DateTime.now().toUTC())
    }, 500);
    return () => clearInterval(interval)
  }, []);

  return (
    <main>
      <Head>
        <title>Truestamp | Observable Entropy</title>
      </Head>

      <section>
        <pre>{entropy && entropy.hash}</pre>
      </section>

      <section>
        <pre>{entropy && entropy.prevHash}</pre>
      </section>

      <section>
        <pre>{entropy && entropy.createdAt}</pre>
      </section>

      <section>
        {dateStateUTC && dateStateUTC.toISO()}
      </section>
      <section>
        {dateStateUTC && dateStateUTC.toMillis()}
      </section>
      <section>
        {dateStateUTC && dateStateUTC.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}
      </section>

    </main>
  )
}
