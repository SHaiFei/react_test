import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom"
import 'antd/dist/reset.css'; // 用于引入 antd 的重置样式
import './App.css'
import router from "@/router"

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <RouterProvider router={router} />
  // </StrictMode>,
)
