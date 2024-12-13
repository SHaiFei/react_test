import React from 'react'
import { Outlet } from "react-router-dom";
import Header from '@/view/components/BrainHeader/Header'

import './index.scss'
export default function Create () {
  return (
    <div className='create_assistant '>
      <Header />
      <div className='create_assistant_form'>
        <Outlet />
      </div>
    </div>
  )
}
