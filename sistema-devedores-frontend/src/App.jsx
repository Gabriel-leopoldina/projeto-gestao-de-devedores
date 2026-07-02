import { BrowserRouter, Routes, Route } from 'react-router-dom'

import DevedoresPage from './pages/DevedoresPage.jsx'
import DividasPage from './pages/DividasPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DevedoresPage />} />

        <Route
          path="/devedores/:id/dividas"
          element={<DividasPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}