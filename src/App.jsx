import { useState } from 'react'
import Login from '../pages/login'
import Register from '../pages/register'
import HomeSeller from '../pages/home'
import Homebuyer from '../pages/homebuyer'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
function App() {
 

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Register/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/homeseller' element={<HomeSeller/>}></Route>
      <Route path='/homebuyer' element={<Homebuyer/>}></Route>

    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
