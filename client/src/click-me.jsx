import { useState, useEffect } from "react"

export const ClickMe = () => {

  const [total, setTotal] = useState(10)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count > total) {
      setTotal(total + 10)
      setCount(0)
    }
  }, [count])

  const barStyle = {
    width: `${(count / total) * 100}%`
  }

  const increment = () => setCount(count + 1)

  return (
    <div className="click-me">
      <div className="content">
        <span className="current-count">{count}</span>
        <div className="progress">
          <div className="progress-bar" style={barStyle}></div>
        </div>
        <button onClick={increment}>click me</button>
      </div>
    </div>
  )
}
