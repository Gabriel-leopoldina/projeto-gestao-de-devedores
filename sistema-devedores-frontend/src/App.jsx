import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './layout/Layout.jsx'
import DevedoresPage from './pages/DevedoresPage.jsx'
import DividasPage from './pages/DividasPage.jsx'
import HomePage from './pages/HomePage'
import TodasDividasPage from './pages/TodasDividasPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout />}>

  
          <Route 
            path="/" 
            element={<HomePage />} 
          />
          

          <Route
            path="/devedores"
            element={<DevedoresPage />}
          />

          <Route
          path="/dividas"
          element={<TodasDividasPage />}
        />

            <Route
              path="/devedores/:id/dividas"
              element={<DividasPage />}
            />

        </Route>

      </Routes>
      
    </BrowserRouter>
  )
}