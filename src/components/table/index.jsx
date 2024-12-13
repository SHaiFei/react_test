import React from 'react';
import { Table, Pagination, Input, Button } from 'antd';
import './index.scss'

// 通用表格组件
const CustomTable = ({
  dataSource,
  columns,
  total,
  onPageChange,
  onSearch,
  onSortChange,
  currentPage,
  pageSize = 10,
  loading = false,
  tableHeight,
  fixed,
}) => {

  // 表格排序变化
  const handleSortChange = (pagination, filters, sorter) => {
    if (onSortChange) {
      onSortChange(sorter);
    }
  };

  const pageChange = async (val) => {
    onPageChange(val)
  }

  return (
    <div className="custom-table">
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}  // 禁用默认分页，由外部控制
        loading={loading}
        onChange={handleSortChange}
        rowKey="id"
        fixed={fixed}
        scroll={{ y: tableHeight }}
      />
      {/* x: 'max-content', */}
      {/* 分页 */}
      <Pagination
        style={{ marginTop: '10px' }}
        align="center"
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={pageChange}
        showSizeChanger={false}
        showTotal={(total) => `共 ${total} 条`}
      />
    </div>
  );
};

export default CustomTable;
