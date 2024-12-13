import { useState, useEffect } from 'react'
import { assistantList } from '@/apis/brain'
import { Button, Menu, Popover } from 'antd';

import hot from '@/assets/image/hot.png'
import share from '@/assets/image/share.png'
import './index.scss'

export default function BrainStore () {
  const [assistants, setAssistants] = useState([]);  // 列表数据

  const getAssistantList = async () => {
    const { code, data } = await assistantList()
    if (code === 200) {
      setAssistants(data.list)
    }
  }
  useEffect(() => {
    getAssistantList(); // 组件挂载时获取数据
  }, []);
  return (
    <>
      <div className='brain-marketplace-container'>
        <ul className='brain-marketplace-list'>
          {assistants.map((item, index) => {
            return (
              <li className='brain-item' key={index}>
                {/* 头部 */}
                <div className="brain-introduce">
                  <div className="brain-item-logo">
                    <div className="white-mask"></div>
                    <img src={item.image_url} alt="brain" />
                  </div>
                  <div className="brain-item-name">{item.name}</div>
                  <div className="brain-item-subtitle">{item.description}</div>
                </div>
                {/* 中间 */}
                <div className="brain-item-controls">
                  <div className="controls-left">
                    <img className="logo" src={hot} alt="hot" />
                    <span className="label">{item.click}</span>
                  </div>
                  <div className="controls-right">
                    <span className="label">{item.user_name}</span>
                    <img className="logo" style={{ borderRadius: '50%', marginLeft: '5px' }} src={item.user_head_image} alt="user" />
                  </div>
                </div>

                {/* 隐藏部分 */}
                <div className="brain-item-hover">
                  <Button className='brain-chat-btn' type="primary" style={{ height: '30px' }}>
                    {item.assistant_type === 2 ? item.button_name : '聊天'}
                  </Button>

                  <div className='d-flex align-center'>
                    <Button size='small'>
                      <img
                        className="brain-hover-btn"
                        src={
                          item.current_user_is_favorite
                            ? 'https://oss.minio.ratuads.com:8143/ratuai/ratu_brain_public/Favorite_2.png'
                            : 'https://oss.minio.ratuads.com:8143/ratuai/ratu_brain_public/Favorite_1.png'
                        }
                        alt="collect"
                      />
                    </Button>
                    <Button size='small'>
                      <img className="brain-hover-btn" src={share} alt="share" />
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
