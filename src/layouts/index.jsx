import React from 'react';
import { Flex, Layout } from 'antd';
import BrainMenu from '@/view/brain/brainMenu'
import { Outlet } from "react-router-dom"; // 引入 Outlet 组件
import './index.scss'
const { Footer, Sider, Content } = Layout;

export default function index () {
  return (
    <div className='layouts-wrapper'>
      <Layout >
        <Sider className='silder-wrapper' width="14%" >
          <BrainMenu />
        </Sider>
        <Layout>
          <Layout.Content className='content'>
            <Outlet />  {/* 这里会渲染匹配的子路由组件 */}
          </Layout.Content>
          <Footer className='footer' style={{ padding: 0 }}>
            <div className="ratubrain-record-conent">
              Copyright©2023 北京中科睿途科技有限公司版权所有
            </div>
          </Footer>
        </Layout>
      </Layout>
    </div>
  )
}
