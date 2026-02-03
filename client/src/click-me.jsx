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

  const countStyle = {
    marginRight: ((count / total) * 10) > 2 ? '1rem' : '0',
  }

  const increment = () => {
    if (count < total) setCount(count + 1)
  }

  return (
    <div className="click-me">
      <div className="content">
        <span className="total">{total}</span>
        <div className="progress">
          <div className="progress-bar" style={barStyle}>
            <div className="current-count" style={countStyle}>{count}</div>
          </div>
        </div>
        <button onClick={increment}>CLICK ME</button>
      </div>
    </div>
  )
}
