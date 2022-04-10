// Copyright © 2020-2021 Truestamp Inc. All rights reserved.

import React, { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import Script from "next/script"
import useSWR from "swr"
import { DateTime } from "luxon"

import ReactDOM from "react-dom"
import QRCode from "react-qr-code"

import "tailwindcss/tailwind.css"
import {
  ClockIcon,
  AtSymbolIcon,
  InformationCircleIcon,
} from "@heroicons/react/solid"

const ENTROPY_LATEST_URL = "https://entropy.truestamp.com/latest"
// const ENTROPY_HASH_URL = "https://entropy.truestamp.com/hash"
const ENTROPY_VERIFY_HASH_URL = "https://entropy.truestamp.com/verify/hash"
const ENTROPY_REFRESH_MS = 1000
const CLOCK_REFRESH_MS = 1000 / 30 // 30fps

const fetcher = async (input: RequestInfo, init: RequestInit) => {
  const res = await fetch(input, init)
  return res.json()
}

function useEntropy() {
  const { data, error } = useSWR(ENTROPY_LATEST_URL, fetcher, {
    refreshInterval: ENTROPY_REFRESH_MS,
  })

  return {
    entropy: data,
    isLoading: !error && !data,
    isError: error,
  }
}

function HomePage({}) {
  const [dateState, setDateState] = useState(DateTime.now())
  const { entropy, isLoading, isError } = useEntropy()

  useEffect(() => {
    const interval = setInterval(() => {
      setDateState(DateTime.now())
    }, CLOCK_REFRESH_MS)
    return () => clearInterval(interval)
  }, [])

  function hashColor() {
    if (isError) {
      return " text-red-500"
    } else if (isLoading) {
      return " text-gray-500"
    } else if (entropy) {
      return " text-yellow-100"
    }
  }

  function displayCreatedAt() {
    if (!entropy || !entropy.createdAt) return ""

    const createdAt = DateTime.fromISO(entropy.createdAt)
    return createdAt.toUTC().toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
  }

  function displayCreatedAtDiff() {
    if (!entropy || !entropy.createdAt) return ""

    const createdAt = DateTime.fromISO(entropy.createdAt)
    const diff = DateTime.now().toUTC().diff(createdAt, ["minutes", "seconds"])
    return `${diff.minutes}m ${Math.floor(diff.seconds)}s`
  }

  return (
    <body className="min-h-screen p-0 bg-gradient-to-tr from-[#00aeef] via-[#2a3990] to-purple-600">
      <Head>
        <title>Truestamp | Observable Entropy</title>

        <meta
          name="description"
          content="Truestamp Observable Entropy captures and store public sources of entropy and generates incontestable public randomness that is independently verifiable."
        />
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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="manifest"
          href="/site.webmanifest"
          crossOrigin="use-credentials"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1059a9" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content="Truestamp" />
        <meta name="application-name" content="Truestamp" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <main className="">
        <div className="grid grid-cols-1 mb-5">
          {entropy && dateState && (
            <>
              <a
                href={`${ENTROPY_VERIFY_HASH_URL}/${entropy.hash}`}
                target="_blank"
                rel="noreferrer"
                className="place-self-center"
              >
                {/* Large QR : Show only when printing */}
                <span className="hidden print:block">
                  <div className={"bg-white p-10"}>
                    <QRCode
                      id="QRCode"
                      size={750}
                      level={"H"}
                      value={`${ENTROPY_VERIFY_HASH_URL}/${entropy.hash}`}
                    />
                  </div>
                </span>

                {/* Medium QR : Show only on larger devices, and not when printed */}
                <div className="bg-white p-10 mt-10 hidden sm:block">
                  <span className="print:hidden">
                    <QRCode
                      id="QRCode"
                      fgColor={"#2a3990"}
                      size={650}
                      level={"H"}
                      title={`${ENTROPY_VERIFY_HASH_URL}/${entropy.hash}`}
                      value={`${ENTROPY_VERIFY_HASH_URL}/${entropy.hash}`}
                    />
                  </span>
                </div>

                {/* Small QR : Show only on smaller devices, and not when printed */}
                <div className="bg-white p-10 mt-10 block sm:hidden">
                  <span className="print:hidden">
                    <QRCode
                      id="QRCode"
                      fgColor={"#2a3990"}
                      size={256}
                      level={"H"}
                      title={`${ENTROPY_VERIFY_HASH_URL}/${entropy.hash}`}
                      value={`${ENTROPY_VERIFY_HASH_URL}/${entropy.hash}`}
                    />
                  </span>
                </div>
              </a>

              <a
                href={`${ENTROPY_VERIFY_HASH_URL}/${entropy.hash}`}
                target="_blank"
                rel="noreferrer"
                className={
                  "print:mt-0 mt-5 font-mono font-bold text-center text-lg md:text-2xl xl:text-3xl 2xl:text-4xl break-words md:break-normal " +
                  hashColor()
                }
              >
                <span className="print:text-black print:text-5xl">
                  {entropy?.hash.substring(0, 32)}
                </span>
              </a>

              <a
                href={`${ENTROPY_VERIFY_HASH_URL}/${entropy.hash}`}
                target="_blank"
                rel="noreferrer"
                className={
                  "font-mono font-bold text-center text-lg md:text-2xl xl:text-3xl 2xl:text-4xl break-words md:break-normal " +
                  hashColor()
                }
              >
                <span className="print:text-black print:text-5xl">
                  {entropy?.hash.substring(32, 64)}
                </span>
              </a>

              <p className="text-center mt-5">
                <span className="print:hidden text-sm sm:text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl text-yellow-100">
                  {dateState
                    .toUTC()
                    .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}
                </span>
              </p>

              <p className="text-center mt-5">
                <span className="print:hidden font-mono text-sm sm:text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl text-yellow-100">
                  [{dateState.toFormat("x")} ms]
                </span>
              </p>

              <p className="print:hidden mt-5 text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl text-center text-yellow-100">
                Updated {displayCreatedAtDiff()} ago
              </p>

              <div className="print:hidden mt-5 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* <!-- We've used 3xl here, but feel free to try other max-widths based on your needs --> */}
                <div className="max-w-2xl mx-auto text-yellow-100">
                  Print and include this page in the near background of your
                  shot so that the QR code and hash are clearly visible.
                  Alternatively, display it on a screen in the near background
                  of the shot. Scanning the QR code allow others to verify the
                  time context of your content and can prove it was created
                  after a point in time. Combining this with a{" "}
                  <a
                    href="https://www.truestamp.com"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Truestamp
                  </a>{" "}
                  commitment of your content can tightly define the time of
                  creation for documentary or evidentiary purposes.
                </div>
              </div>
            </>
          )}
          {!entropy && (
            <>
              <p
                className={
                  "w-5/6 md:w-full text-center text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl break-words md:break-normal mb-10 font-bold text-gray-500"
                }
              >
                loading...
              </p>
            </>
          )}
        </div>
      </main>

      <footer className="h-10 sm:h-15 sm:mb-15">
        {/* Display Footer */}
        <span className="print:hidden">
          <p className="text-xs sm:text-sm md:text-lg lg:text-2xl text-center font-light text-yellow-100">
            The{" "}
            <a
              href="https://github.com/truestamp/observable-entropy/blob/main/README.md"
              className="text-yellow-300 hover:text-yellow-100"
              target="_blank"
              rel="noreferrer"
            >
              Observable Entropy
            </a>{" "}
            project
            <span className="inline sm:hidden">
              <br />
            </span>
            <span className="hidden sm:inline">, </span>
            &copy; 2021-{DateTime.now().toUTC().toFormat("yyyy")}{" "}
            <a
              href="https://www.truestamp.com"
              className="text-yellow-300 hover:text-yellow-100"
              target="_blank"
              rel="noreferrer"
            >
              Truestamp Inc.
            </a>
          </p>
        </span>

        {/* Print Footer */}
        <p className="hidden print:block print:text-black print:text-4xl print:place-self-center print:text-center">
          {dateState
            .toUTC()
            .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}
          <br />
          https://observable-entropy.truestamp.com
        </p>
      </footer>

      <Script
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "e045c587d3224c8a8e309f607ee65a0d"}'
      />
    </body>
  )
}

export default HomePage
