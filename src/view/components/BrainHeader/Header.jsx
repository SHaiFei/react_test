import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd'
import eventBus from '@/eventBus';

import './index.scss'
import arrow from '../../../assets/image/up-arrow.png'

const list = [
  { path: '/brain/create/assistant', label: '创建' },
  { path: '/brain/create/knowledge', label: '知识库' },
  { path: '/brain/create/apiTools', label: 'API工具' }
]

export default function Header () {
  const navigate = useNavigate(); // 导航方法
  const [activeIndex, setActiveIndex] = useState(0);

  const setActive = (item, index) => {
    setActiveIndex(index);  // 更新为当前点击项的索引
  };

  // 保存
  const save = () => {
    eventBus.emit('handleSave', 'Header按钮点击事件数据');
  }

  const clearForm = () => {
    navigate('/brain')
  }
  return (
    <div className='header'>
      <div className='header_left_info'>
        <div>
          <div className='user-avatar-content'>
            <img width="24" style={{ cursor: 'pointer' }} src={arrow} className="leftArrow" onClick={clearForm} />
            <img className='user_head_sculpture_url' src="https://oss.minio.ratuads.com:8143/ratuai/ratubrain/ratu_brain_user/cf36e30f-0fd8-4dbe-8a41-78b675f7acc0_场景三.png" alt="" />
            <div className='assistant-info'>
              <h3>兵马俑</h3>
              <p>1732607607997</p>
            </div>
          </div>
        </div>
      </div>
      <div className='header_content'>
        {list.map((item, index) => {
          return (
            <div key={item.path} className={activeIndex === index ? 'active' : ''} onClick={() => setActive(item, index)}>{item.label}</div>
          )
        })}
      </div>
      <div className='header_right_button'>
        <Button onClick={save}>保存</Button>
        <Button type="primary" className='publish'>发布</Button>
      </div>
    </div>
  )
}
