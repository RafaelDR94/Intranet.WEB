import { useState } from 'react'

/** Hook providing internal state for Card component */
export const useCard = () => {
  const [clicked, setClicked] = useState(false)
  const handleClick = () => setClicked(true)
  return { clicked, handleClick }
}
