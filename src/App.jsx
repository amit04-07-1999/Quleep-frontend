
// import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import OwnerHome from './pages/OwnerHome';
import Login from './pages/Login';
import Register from './pages/Register';


function App() {

  return (
    <BrowserRouter >
      <Routes >
        <Route path='/' element={<Home/>}></Route>
        <Route path='/owner' element={<OwnerHome/>}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App