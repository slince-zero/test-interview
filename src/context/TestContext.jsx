import { createContext, useState } from 'react'

export const TestContext = createContext({})

export default function TestContextProvider({ children }) {
  const [leftRef, setLeftRef] = useState(null)

  return (
    <TestContext.Provider
      value={{
        leftRef,
        setLeftRef,
      }}>
      {children}
    </TestContext.Provider>
  )
}
