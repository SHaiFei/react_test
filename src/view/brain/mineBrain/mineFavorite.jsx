import React, { useEffect, useState } from 'react'
import { Button, Dropdown, } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { getFavoriteBrain } from '@/apis/brain'

import './index.scss'

const items = [
  {
    key: '1',
    label: (<p>分享</p>),
  },
  {
    key: '2',
    label: (<p>取消分享</p>),
  },
];
export default function mineFavorite ({ handleBrainData, page_number }) {
  const [mineFavoriteBrain, setMineFavoriteBrain] = useState([]);  // 列表数据

  const getMineBrain = async () => {
    const params = { page_size: 32, page_number: page_number }
    const { code, data } = await getFavoriteBrain(params)
    if (code === 200) {
      setMineFavoriteBrain(data.user_favorite_assistant)

      handleBrainData(data)
    }
  }

    useEffect(() => {
      getMineBrain()
    }, [page_number])
  return (
    <div className='create-brain-list'>
      {mineFavoriteBrain.length === 0 && <div className="create-brain-empty">您还未创建智能体</div>}
      <div className='create-brain-list-wrapper'>
        {mineFavoriteBrain.map((item) => {
          return (
            <div className='create-brain-list-item' key={item.assistant_id}>
              <img className="mine-brain-bg" src={`${item.image_url || item.assistant_url}`} />
              <p className="text">{item.name || item.assistant_name}</p>
              {item.status === '草稿' && !item.is_delete && (<div className="create-timeimg">创建中</div>)}
              <div className="create-brain-chat-btn">
                {item.status === '草稿' && (<span></span>)}
                <div className='btn_list'>
                  <Dropdown menu={{ items }} trigger={['click']}  >
                    <Button className='btn_list_edit_btn'><EllipsisOutlined /></Button>
                  </Dropdown>
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}
