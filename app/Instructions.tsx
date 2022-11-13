import Link from "next/link"

export default function Instructions() {
  return (
    <div className="print:hidden mt-5 rounded-xl p-8 bg-neutral text-neutral-content">
      <p>
        Print or display this QR code so that it is clearly visible in the
        background of a photo or video. It will auto-refresh about every 5
        minutes. Anyone scanning the QR code will be able to verify your media
        was created after a point in time. If printing, refresh the print once
        per day.{" "}
        <Link
          href="https://github.com/truestamp/observable-entropy-v2/blob/main/README.md"
          target="_blank"
          className="link underline"
        >
          Learn more
        </Link>
        .
      </p>

      <p className="mt-5">
        After capture, submit a hash of your media to{" "}
        <Link
          href="https://www.truestamp.com"
          target="_blank"
          className="link underline"
        >
          Truestamp
        </Link>{" "}
        to bind its creation to a verifiable time window.
      </p>
    </div>
  )
}
