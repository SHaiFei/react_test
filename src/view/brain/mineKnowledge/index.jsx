import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import CustomTable from '@/components/table';
import useMessage from '@/utils/useMessage';
import { Tooltip, Button } from 'antd';
import { getBrainFiles } from '@/apis/brain'

// 表格列
const columns = [
  {
    title: '文件名称',
    dataIndex: 'file_name',
    ellipsis: true,
    render: (file_name) => (
      <Tooltip placement="topLeft" title={file_name}>
        {file_name}
      </Tooltip>
    ),
  },
  {
    title: '内容描述',
    dataIndex: 'specification',
    ellipsis: true,
    render: (specification) =>
      <Tooltip placement="topLeft" title={specification}>
        {specification}
      </Tooltip>,
  },
  {
    title: '大小', dataIndex: 'file_size', ellipsis: true, width: 100,
    render: (file_size) => (
      <Tooltip placement="topLeft" title={file_size}>
        {file_size}
      </Tooltip>
    ),
  },
  {
    title: '添加方式', dataIndex: 'upload_type', ellipsis: true, width: 100,
    render: (upload_type) => (
      <Tooltip placement="topLeft" title={upload_type}>
        {upload_type}
      </Tooltip>
    ),
  },
  {
    title: '更新时间', dataIndex: 'update_time', ellipsis: true, width: 120,
    render: (update_time) => (
      <Tooltip placement="topLeft" title={update_time}>
        {dayjs(update_time).format('YYYY-MM-DD')}
      </Tooltip>
    ),
  },
  {
    title: '状态', dataIndex: 'status', ellipsis: true, width: 100,
    render: (status) => (
      <Tooltip placement="topLeft" title={status}>
        {status}
      </Tooltip>
    ),
  },
  {
    title: '关联智能体', dataIndex: 'assistant_name_list', ellipsis: true, width: 140,
    render: (assistant_name_list) => (
      <Tooltip placement="topLeft" title={assistant_name_list}>
        {assistant_name_list}
      </Tooltip>
    ),
  },
  {
    title: '操作', dataIndex: 'actions', width: 390,
    align: 'right',
    fixed: 'right',
    render: (text, record) => {
      return (
        <>
          {
            !['csv', 'xlsx'].includes(record.file_type) &&
            (<Button color="primary" variant="text">
              {record.status === '解析失败' || record.status === '学习完毕' ? '重新解析' : '查看解析结果'}
            </Button>)
          }
          {<Button
            color="primary"
            variant="text"
            disabled={record.isLoading || record.status === '解析失败' || record.status === '学习完毕'}>
            {record.status === '分段失败' ? '重新分段' : '查看分段'}
          </Button>}
          {<Button
            color="primary"
            variant="text"
            disabled={record.isLoading}>
            删除
          </Button>}
        </>
      )
    }
  }
];

export default function MineKnowledge () {
  const { success, errorMessage } = useMessage()  // 消息提醒

  const [dataSource, setDataSource] = useState([]) // 表格数据
  const [total, setTotal] = useState([])  // 总条数
  const [tableHeight, setTableHeight] = useState(0) // 表格高度
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(false)


  // 获取列表数据
  const getTableData = async (page_number) => {
    setLoading(true)
    try {
      const { msg, data, code } = await getBrainFiles({ page_number, page_size: 10 })
      if (code === 200) {
        data.file.forEach((item) => {
          if (item.status.includes('中') || item.status === '上传成功') {
            item.isLoading = true;
          } else {
            item.isLoading = false;
          }
          const parts = item.file_name.split('.');
          item.file_type = parts[parts.length - 1].toLowerCase();
        });
        setDataSource(data.file) // 表格数据
        setTotal(data.doc_count) // 数据条数
        success(msg)
      } else {
        errorMessage(msg)
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
    getTableData(page_number)  // 分页改变后重新请求数据
  }

  useEffect(() => {
    getTableData()
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
  }, []);
  return (
    <div>
      <CustomTable
        page_number={pageNumber}
        tableHeight={tableHeight}
        columns={columns}
        dataSource={dataSource}
        total={total}
        loading={loading}
        onPageChange={onPageChange}
      />
    </div>
  )
}
