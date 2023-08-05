import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import PageNotFound from './pages/PageNotFound'
import Layout from './components/layout/Layout'
import IndexPage from './pages/IndexPage'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<IndexPage/> } /> 
          <Route path='login' element={<Login/> } /> 
          <Route path='register' element={<Register/> }/>
        </Route>
        <Route path='*' element={<PageNotFound/>} /> 
      </Routes>
    </>
  )
}

export default App
