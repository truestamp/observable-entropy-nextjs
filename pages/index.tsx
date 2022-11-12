// Copyright © 2020-2022 Truestamp Inc. All rights reserved.

import React, { useState, useEffect } from "react"
import Head from "next/head"
import useSWR from "swr"
import { DateTime } from "luxon"
import QRCode from "react-qr-code"

import "tailwindcss/tailwind.css"
import Link from "next/link"

const ENTROPY_LATEST_URL = "https://entropy-v2.truestamp.com/latest.json"
const ENTROPY_VERIFY_HASH_URL = "https://entropy-v2.truestamp.com"
const ENTROPY_REFRESH_MS = 1000 * 10 // 10 seconds
const CLOCK_REFRESH_MS = 1000

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
      return " text-gray-100"
    }
  }

  function displayCapturedAtDiff(capturedAtStr: string) {
    if (!capturedAtStr) return ""

    const capturedAt = DateTime.fromISO(capturedAtStr)
    const diff = DateTime.now().toUTC().diff(capturedAt, ["minutes", "seconds"])
    return `${diff.minutes}m ${Math.floor(diff.seconds)}s`
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <p>Loading...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <p>Error...</p>
      </div>
    )
  }

  const entropyUrl = `${ENTROPY_VERIFY_HASH_URL}/${entropy.hash}.json`

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
          <h1 className="mt-5 text-3xl text-center font-semibold text-gray-200">
            <Link
              href="https://github.com/truestamp/observable-entropy-v2/blob/main/README.md/"
              target={"_blank"}
            >
              Observable Entropy
            </Link>
          </h1>

          {entropy && dateState && (
            <>
              <a
                href={entropyUrl}
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
                      value={entropyUrl}
                    />
                  </div>
                </span>

                {/* Medium QR : Show only on larger devices, and not when printed */}
                <div className="bg-white p-10 mt-10 hidden sm:block rounded-xl">
                  <span className="print:hidden">
                    <QRCode
                      id="QRCode"
                      fgColor={"#2a3990"}
                      size={650}
                      level={"H"}
                      value={entropyUrl}
                    />
                  </span>
                </div>

                {/* Small QR : Show only on smaller devices, and not when printed */}
                <div className="bg-white p-10 mt-10 block sm:hidden rounded-xl">
                  <span className="print:hidden">
                    <QRCode
                      id="QRCode"
                      fgColor={"#2a3990"}
                      size={256}
                      level={"H"}
                      value={entropyUrl}
                    />
                  </span>
                </div>
              </a>

              <a
                href={entropyUrl}
                target="_blank"
                rel="noreferrer"
                className={
                  "print:mt-0 mt-5 font-mono font-bold text-center text-lg md:text-2xl xl:text-3xl 2xl:text-4xl break-words md:break-normal " +
                  hashColor()
                }
              >
                <p className="print:text-black print:text-5xl">
                  {entropy?.hash.substring(0, 32)}
                </p>
                <p className="print:text-black print:text-5xl">
                  {entropy?.hash.substring(32, 64)}
                </p>
                {entropy?.data?.timestamp?.capturedAt && (
                  <p className="text-sm text-center text-gray-200">
                    {`${displayCapturedAtDiff(
                      entropy.data.timestamp.capturedAt
                    )} ago`}{" "}
                  </p>
                )}
              </a>

              <div className="print:hidden mt-5">
                <p className="text-sm text-center sm:text-sm md:text-lg lg:text-2xl text-gray-200">
                  {dateState
                    .toUTC()
                    .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="mt-10 h-10 sm:h-15 sm:mb-15">
        {/* Display Footer */}
        <span className="print:hidden">
          <p className="text-sm text-center text-gray-200">
            Copyright &copy;{" "}
            <Link
              href="https://www.truestamp.com"
              target={"_blank"}
              className={"underline"}
            >
              Truestamp, Inc.
            </Link>{" "}
            {DateTime.now().toUTC().toFormat("yyyy")} All Rights Reserved
          </p>
        </span>

        {/* Print Footer */}
        <p className="hidden print:block print:text-black print:text-2xl print:place-self-center print:text-center">
          {dateState
            .toUTC()
            .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}
          <br />
          https://observable-entropy.truestamp.com
        </p>
      </footer>

      <div className="print:hidden mt-5 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-gray-200">
          Print and include this page in the near background of your shot so
          that the QR code and hash are clearly visible. Alternatively, display
          it on a screen in the near background of the shot. Scanning the QR
          code allow others to verify the time context of your content and can
          prove it was created after a point in time. Combining this with a{" "}
          <a href="https://www.truestamp.com" rel="noreferrer" target="_blank">
            Truestamp
          </a>{" "}
          commitment of your content can tightly define the time of creation for
          documentary or evidentiary purposes.
        </div>
      </div>
    </body>
  )
}

export default HomePage
