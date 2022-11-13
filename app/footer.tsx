"use client"

import Link from "next/link"

export default function Footer() {
  const now = new Date()
  const year = now.getFullYear()

  return (
    <footer className="mt-5 py-5 text-center">
      {/* Display Footer */}
      <span className="print:hidden">
        <p className="text-sm text-center text-gray-400">
          Copyright &copy;{" "}
          <Link
            href="https://www.truestamp.com"
            target={"_blank"}
            className={"underline"}
          >
            Truestamp, Inc.
          </Link>{" "}
          {year} All Rights Reserved
        </p>
      </span>

      {/* Print Footer */}
      <p className="hidden print:block print:text-black print:text-2xl print:place-self-center print:text-center">
        https://observable-entropy.truestamp.com
      </p>
    </footer>
  )
}
