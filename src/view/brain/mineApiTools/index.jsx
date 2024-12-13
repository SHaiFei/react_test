import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { Tooltip, Button } from 'antd';
import CustomTable from '@/components/table';

import { getApiTools } from '@/apis/brain'

// 表格列
const columns = [
  {
    title: 'API名称',
    dataIndex: 'tool_name',
    ellipsis: true,
    render: (tool_name) => (
      <Tooltip placement="topLeft" title={tool_name}>
        {tool_name}
      </Tooltip>
    ),
  },
  {
    title: '简介',
    dataIndex: 'description',
    ellipsis: true,
    render: (description) =>
      <Tooltip placement="topLeft" title={description}>
        {description}
      </Tooltip>,
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 120,
    render: (create_time) => (
      <Tooltip placement="topLeft" title={create_time}>
        {dayjs(create_time).format('YYYY-MM-DD')}
      </Tooltip>
    ),
  },
  {
    title: '关联智能体',
    dataIndex: 'assistant_name_list',
    width: 140,
  },
  {
    title: '状态', dataIndex: 'test_status', width: 100,
    render: (test_status, record) => (
      <>
        {record.test_status === 0 ? '未测试' : record.test_status === 1 ? '测试通过' : '测试失败'}
      </>
    ),
  },
  {
    title: '操作', dataIndex: 'actions', width: 390,
    align: 'right',
    fixed: 'right',
    render: () => {
      return (
        <>
          {<Button color="primary" variant="text">编辑</Button>}
          {<Button color="primary" variant="text">删除</Button>}
        </>
      )
    }
  }
];

export default function MineApiTools () {
  const [dataSource, setDataSource] = useState([]) // 表格数据
  const [total, setTotal] = useState([])  // 总条数
  const [tableHeight, setTableHeight] = useState(0) // 表格高度
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(false)

  const getApiToolsData = async (page_number) => {
    const params = {
      page_number: page_number,
      page_size: 10
    };
    try {
      setLoading(true)
      const { code, data } = await getApiTools(params);
      if (code === 200) {
        setDataSource(data.tool)
        setTotal(data.doc_count)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  // 获取浏览器高度计算后赋值给表格
  const getHeight = async () => {
    const windowHeight = window.innerHeight; // 浏览器的可视高度
    setTableHeight(windowHeight - 170) // 减去头部高度和底部
  }

  // 分页改变
  const onPageChange = async (page_number) => {
    setPageNumber(page_number)  // 修改分页数据在传递给子组件
    getApiToolsData(page_number)  // 分页改变后重新请求数据
  }


  useEffect(() => {
    getApiToolsData()
    getHeight()

    // 监听浏览器大小的变化
    const handleResize = () => {
      getHeight();
    };

    // 添加 resize 事件监听器
    window.addEventListener('resize', handleResize);

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])
  return (
    <>
      <CustomTable
        page_number={pageNumber}
        tableHeight={tableHeight}
        columns={columns}
        dataSource={dataSource}
        total={total}
        loading={loading}
        onPageChange={onPageChange}
      />
    </>
  )
}
