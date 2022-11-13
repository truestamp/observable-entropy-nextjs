import Instructions from "./Instructions"
import EntropyCode from "./EntropyCode"
import EntropyHash from "./EntropyHash"
import CurrentTime from "./CurrentTime"

export default async function Home() {
  return (
    <div>
      <div className="mt-5">
        <CurrentTime />
      </div>

      <div className="mt-5">
        <EntropyCode />
      </div>

      <div className="mt-5">
        <EntropyHash />
      </div>

      <div className="mt-5">
        <Instructions />
      </div>
    </div>
  )
}
