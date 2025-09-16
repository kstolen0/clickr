import { useState, useEffect } from "react"

export const ClickMe = () => {

  const [total, setTotal] = useState(10)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count == total) {
      setTimeout(() => {
        setTotal(total + 10)
        setCount(0)
      }, 500)
    }
  }, [count])

  const barStyle = {
    width: `${(count / total) * 100}%`,
    visibility: count > 0 ? 'visible' : 'hidden',
  }

  const increment = () => {
    if (count < total) setCount(count + 1)
  }

  return (
    <div className="click-me">
      <div className="content">
        <span className="current-count">{count}</span>
        <div className="progress">
          <div className="progress-bar" style={barStyle}>{count}</div>
        </div>
        <button onClick={increment}>click me</button>
      </div>
    </div>
  )
}
