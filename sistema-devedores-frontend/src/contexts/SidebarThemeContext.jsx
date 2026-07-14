import { createContext, useState, useEffect } from 'react'

export const SidebarThemeContext = createContext()

export function SidebarThemeProvider({ children }) {
 
  const [isDarkSidebar, setIsDarkSidebar] = useState(() => {
    const saved = localStorage.getItem('darkSidebar')
    return saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem('darkSidebar', isDarkSidebar)
  }, [isDarkSidebar])

  return (
    <SidebarThemeContext.Provider value={{ isDarkSidebar, setIsDarkSidebar }}>
      {children}
    </SidebarThemeContext.Provider>
  )
}