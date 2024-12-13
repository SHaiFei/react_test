import React, { useState } from 'react'
import { Tabs, Pagination } from 'antd';
import MineCreate from './mineCreate'
import MineFavorite from './mineFavorite'

import './index.scss'

export default function MineBrain () {
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  // 获取分页信息
  const handleBrainData = (data) => {
    setTotal(data.doc_count)
  }

  // 子组件
  const items = [
    {
      key: '1',
      label: '我的创建',
      children: <MineCreate handleBrainData={handleBrainData} page_number={pageNumber} />
    },
    {
      key: '2',
      label: '我的收藏',
      children: <MineFavorite handleBrainData={handleBrainData} page_number={pageNumber} />
    },
  ];

  const onChange = () => {
    setPageNumber(1)
  };

  const pageChange = (val) => {
    setPageNumber(val)
  }

  return (
    <>
      <div className='mine-brain-wrapper'>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        <Pagination className='pagination'
          align="center"
          onChange={pageChange}
          current={pageNumber}
          hideOnSinglePage
          total={total}
          showSizeChanger={false}
          defaultPageSize={32} />
      </div>
    </>
  )
}