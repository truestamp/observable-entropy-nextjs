import Link from "next/link"

export default function Header() {
  return (
    <>
      <div className="grid grid-cols-1 pt-10">
        <h1 className="text-3xl text-center font-bold text-gray-200">
          <Link
            href="https://github.com/truestamp/observable-entropy-v2/blob/main/README.md/"
            target={"_blank"}
          >
            Observable Entropy
          </Link>
        </h1>
      </div>
    </>
  )
}
