import {ToastContainer} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 


import './App.css'
import { Route, Routes } from 'react-router-dom'
import PageNotFound from './pages/PageNotFound'
import Layout from './components/layout/Layout'
import IndexPage from './pages/IndexPage'
import Login from './pages/Login'
import Register from './pages/Register'
import { UserContextProvider } from './context/UserState';
import CreatePost from './pages/CreatePost';

function App() {

  return (
    <div>
      <UserContextProvider>
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route index element={<IndexPage/> } /> 
            <Route path='login' element={<Login/> } /> 
            <Route path='register' element={<Register/> }/>
            <Route path='create' element={<CreatePost/>} /> 
          </Route>
          <Route path='*' element={<PageNotFound/>} /> 
        </Routes>
        <ToastContainer/>
      </UserContextProvider>
    </div>
  )
}

export default App
