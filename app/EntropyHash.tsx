"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

import { DateTime } from "luxon"

import { ENTROPY_BASE_URL } from "./constants"

import { useLatestEntropy } from "./query"

function calculateCapturedAtDiff(capturedAtStr: string) {
  if (!capturedAtStr) return ""

  const capturedAt = DateTime.fromISO(capturedAtStr)
  const diff = DateTime.now().toUTC().diff(capturedAt, ["minutes", "seconds"])
  return `${diff.minutes}m ${Math.floor(diff.seconds)}s ago`
}

export default function EntropyHash() {
  const [capturedAtTimeAgo, setCapturedAtTimeAgoState] = useState("")
  const { isLoading, isError, isSuccess, data, error } = useLatestEntropy()

  useEffect(() => {
    const interval = setInterval(() => {
      setCapturedAtTimeAgoState(
        calculateCapturedAtDiff(data?.data?.timestamp?.capturedAt)
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [data?.data?.timestamp?.capturedAt])

  if (isLoading) return <div>Loading...</div>

  if (isError) return <div>Error: {error.message}</div>

  const entropyUrl = `${ENTROPY_BASE_URL}/${data?.hash}.json`

  return (
    <div>
      <Link
        href={entropyUrl}
        target={"_blank"}
        className={
          "print:mt-0 mt-5 font-mono font-bold text-center text-lg md:text-2xl xl:text-4xl break-words md:break-normal text-gray-200"
        }
      >
        <p className="print:text-black print:text-5xl">
          {data?.hash.substring(0, 32)}
        </p>

        <p className="print:text-black print:text-5xl">
          {data.hash.substring(32, 64)}
        </p>

        {capturedAtTimeAgo && (
          <p className="mt-5 text-sm text-center text-gray-400">
            Collected @ {data?.data?.timestamp?.capturedAt} ({capturedAtTimeAgo}
            )
          </p>
        )}
      </Link>
    </div>
  )
}
