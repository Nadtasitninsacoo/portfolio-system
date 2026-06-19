import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SiteDataProvider } from './site/SiteData'
import { PublicSite } from './site/PublicSite'
import { Login } from './admin/Login'
import { Admin } from './admin/Admin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <SiteDataProvider>
              <PublicSite />
            </SiteDataProvider>
          }
        />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
