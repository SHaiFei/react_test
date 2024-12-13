import { React, useState, useEffect } from 'react'
import newLogo from '../../../assets/image/svg/new-logo.svg'
import { Button, Menu, Popover } from 'antd';
import { PlusOutlined, HomeOutlined, BarsOutlined, SmileOutlined, FolderOutlined, ToolOutlined, SettingOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss'

const items = [
  {
    key: '/brain/brainStore',
    label: '智能体中心',
    icon: <HomeOutlined />
  },
  {
    key: '/brain/demo',
    label: '内侧',
    icon: <BarsOutlined />
  },
  {
    key: '/brain/mineBrain',
    label: '我的智能体',
    icon: <SmileOutlined />
  },
  {
    key: '/brain/mineKnowledge',
    label: '我的知识库',
    icon: <FolderOutlined />
  },
  {
    key: '/brain/mineApiTools',
    label: '我的自定义工具',
    icon: <ToolOutlined />
  },
  {
    key: '/auth/feedback',
    label: '问题反馈',
    icon: <SettingOutlined />
  },
  {
    key: '6',
    label: '用户指南',
    icon: <UserSwitchOutlined />
  },
];
const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);
export default function brainMinu () {
  const navigate = useNavigate(); // 导航方法
  const location = useLocation(); // 获取当前路由的路径
  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);

  useEffect(() => {
    // 当路由发生变化时更新 selectedKeys
    setSelectedKeys([location.pathname]);
  }, [location]);

  // 点击后跳转路由
  const handleClick = (e) => {
    if (e.key === '6') {
      window.open('https://ratutech.feishu.cn/docx/UhuSdSvoLoqLOHxk94FcwFn6nOh', '_blank');
    } else {
      navigate(e.key); // 根据 key 跳转
    }
  };

  // 创建智能体
  const createForm = () => {
    navigate('/brain/create/assistant')
  }

  return (
    <>
      <section className='brain-menu'>
        <div>
          <img className="login-logo" src={newLogo} alt="logo" />
        </div>
        <div className='create'>
          <Button type="primary" size='large' icon={<PlusOutlined />} onClick={createForm}>创建智能体</Button>
        </div>
        <Menu
          className='menu-list'
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={handleClick}
          items={items}
        />


        {/* <div className='user-info'>
          <Popover content={content} title="个人中心" trigger="click">
            <Button>Click me</Button>
          </Popover>
        </div> */}
      </section>
    </>
  )
}
