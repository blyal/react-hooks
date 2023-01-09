// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  stateKey,
  defaultState = '',
  {serialise = JSON.stringify, deserialise = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(stateKey)
    if (valueInLocalStorage) return deserialise(valueInLocalStorage)
    return typeof defaultState === 'function' ? defaultState() : defaultState
  })

  const prevStateKeyRef = React.useRef(stateKey)

  React.useEffect(() => {
    const hasKeyChanged = prevStateKeyRef.current !== stateKey
    if (hasKeyChanged) {
      window.localStorage.removeItem(prevStateKeyRef)
      prevStateKeyRef.current = stateKey
    }
    window.localStorage.setItem(stateKey, serialise(state))
  }, [stateKey, serialise, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName

  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
