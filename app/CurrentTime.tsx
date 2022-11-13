"use client"

import React, { useState, useEffect } from "react"
import { DateTime } from "luxon"

export default function CurrentTime() {
  const [dateState, setDateState] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDateState(
        DateTime.now()
          .toUTC()
          .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="print:hidden mt-5">
      <p className="font-mono font-thin text-sm text-center sm:text-sm md:text-lg lg:text-xl text-gray-200">
        {dateState}
      </p>
    </div>
  )
}
