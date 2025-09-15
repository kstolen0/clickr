import { useState } from "react"

export const ClickMe = () => {

  const total = 10
  const [count, setCount] = useState(0)

  return (
    <div className="click-me">
      <span className="current-count">{count}</span>
      <div className="progress">{total}</div>
      <button onClick={() => setCount(count + 1)}>click me</button>
    </div>
  )
}
