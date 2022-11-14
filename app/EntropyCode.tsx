"use client"

import Link from "next/link"
import QRCode from "react-qr-code"

import { useLatestEntropy } from "./query"

import { ENTROPY_BASE_URL } from "./constants"

export default function EntropyCode() {
  const { isLoading, isError, isSuccess, data, error } = useLatestEntropy()

  if (isLoading) return <div>Loading...</div>

  if (isError) return <div>Error: {error.message}</div>

  const entropyUrl = `${ENTROPY_BASE_URL}/${data?.hash}`

  return (
    <div className="grid grid-cols-1">
      <Link href={entropyUrl} target={"_blank"} className="place-self-center">
        {/* Large QR : Show only when printing */}
        <span className="hidden print:block">
          <div className={"bg-white p-10"}>
            <QRCode id="QRCode" size={750} level={"H"} value={entropyUrl} />
          </div>
        </span>

        {/* Medium QR : Show only on larger devices, and not when printed */}
        <div className="bg-white p-10 mt-5 hidden sm:block rounded-xl">
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
        <div className="bg-white p-10 mt-5 block sm:hidden rounded-xl">
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
      </Link>
    </div>
  )
}
