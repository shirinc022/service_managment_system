import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../common/Header'
import Footer from '../common/Footer'

function Userlayout() {
  return (
    <div className='flex flex-col min-h-screen'>
        <Header/>
       <div className='flex-grow'>
       <Outlet/>
       </div>
        <Footer/>
      
    </div>
  )
}

export default Userlayout
