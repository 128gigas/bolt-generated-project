import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ClubList } from './components/ClubList'
import { Dashboard } from './components/Dashboard'
import { CategoryList } from './components/CategoryList'
import { CategoryDetail } from './components/CategoryDetail'
import { AddCategory } from './components/forms/AddCategory'
import { AddPlayer } from './components/forms/AddPlayer'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ClubList />} />
        <Route path="/clubs/:clubId" element={<Dashboard />} />
        <Route path="/clubs/:clubId/categories" element={<CategoryList />} />
        <Route path="/clubs/:clubId/categories/new" element={<AddCategory />} />
        <Route path="/clubs/:clubId/categories/:categoryId" element={<CategoryDetail />} />
        <Route path="/clubs/:clubId/players/new" element={<AddPlayer />} />
      </Routes>
    </Layout>
  )
}

export default App
