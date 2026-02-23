import { useState, useEffect } from 'react'
import RegistrationForm from './components/RegistrationForm'

export default function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <>
      <button
        onClick={() => setDarkMode(d => !d)}
        className="fixed top-4 right-4 z-50 px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition-colors duration-200"
        aria-label="Cambiar tema"
      >
        {darkMode ? 'Modo claro' : 'Modo oscuro'}
      </button>
      <RegistrationForm />
    </>
  )
}
