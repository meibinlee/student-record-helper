import { useState } from 'react'
import './App.css'

import HomePage from './pages/HomePage'
import SubjectPromptPage from './pages/SubjectPromptPage'

function App() {
  const [page, setPage] = useState('home')

  if (page === 'subject') {
    return (
      <SubjectPromptPage
        onBack={() => setPage('home')}
      />
    )
  }

  return (
    <HomePage
      onSelectPage={setPage}
    />
  )
}

export default App