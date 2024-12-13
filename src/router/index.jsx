import { lazy, Suspense } from "react";
// 关键代码
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Loading from "@/components/loading";
import Layout from '@/layouts'

// 自定义懒加载组件
const LazyComponent = (importFunc) => {
  const Component = lazy(importFunc); // 直接调用 lazy(importFunc)
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: LazyComponent(() => import("@/view/login")),
  },
  {
    path: "/brain/create",
    element: LazyComponent(() => import("@/view/components/Create/Create")),
    children: [
      {
        path: "/brain/create/assistant",
        element: LazyComponent(() => import("@/view/CreateForm/index")),
      }
    ]
  },
  {
    path: "/brain",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Navigate to="brainStore" />,
      },
      {
        path: "/brain/brainStore",
        element: LazyComponent(() => import("@/view/brain/brainStore")),
      },
      {
        path: "/brain/demo",
        element: LazyComponent(() => import("@/view/brain/demo")),
      },
      {
        path: "/brain/mineBrain",
        element: LazyComponent(() => import("@/view/brain/mineBrain")),
      },
      {
        path: "/brain/mineKnowledge",
        element: LazyComponent(() => import("@/view/brain/mineKnowledge")),
      },
      {
        path: "/brain/mineApiTools",
        element: LazyComponent(() => import("@/view/brain/mineApiTools")),
      },
    ]
  },
])

export default router