import { ConfigProvider } from "antd";
import { BrowserRouter, useRoutes } from "react-router-dom";
import routes from "./router/index";

// 渲染路由
function RouteElement () {
  const element = useRoutes(routes.routes);
  return element;
}

function App () {

  return (
    <>
      <h1>Hello, React!</h1>
    </>

  )
}

export default App
