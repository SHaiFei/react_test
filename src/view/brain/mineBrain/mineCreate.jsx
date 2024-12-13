import React, { useEffect, useState, useRef } from 'react'
import { Button, Dropdown, Input } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useNavigate, } from 'react-router-dom';
import CustomModal from '@/components/modal'
import useMessage from '@/utils/useMessage';

import { getCreateBrain, brainDel } from '@/apis/brain'
import './index.scss'

export default function mineCreate ({ handleBrainData, page_number }) {
  const { warning, success } = useMessage();
  const navigate = useNavigate(); // 导航方法
  const modalRef = useRef(null);
  const [mineCreateBrain, setMineCreateBrain] = useState([]);  // 列表数据
  const [itemData, setItemData] = useState(null);
  const [childrenType, setChildrenType] = useState(null)
  const [actionType, setActionType] = useState(null);

  // 获取数据
  const getMineBrain = async () => {
    const params = {
      page_size: 32,
      page_number: page_number
    };
    const { code, data } = await getCreateBrain(params)
    if (code === 200) {
      setMineCreateBrain(data.user_create_assistant)

      // 获取分页信息传递给父组件的分页
      handleBrainData(data)
    }
  }

  // 编辑
  const brainEdit = async (item) => {
    navigate(`/brain/create/assistant?id=${item.id}`)
  }

  // 显示删除确定弹框
  const handleShowModal = (item) => {
    modalRef.current.showModal();
    setChildrenType('确定要删除吗，删除后不可恢复？')
    setItemData(item)
    setActionType('delete');
  };

  // 删除助手
  const handleRemoveBrain = async (item) => {
    if (item) {
      let { code, msg } = await brainDel({ assistant_id: item.id || item.assistant_id });
      if (code === 200) {
        await getMineBrain();
        success(msg)
        modalRef.current.hideModal();
      } else {
        warning(msg)
      }
    }
  };

  // 复制弹框
  const handleCopy = async (item) => {
    modalRef.current.showModal();
    setChildrenType(
      <Input placeholder="请输入助手名称" />
    )
    setItemData(item)
    setActionType('copy');
  }


  // 弹框确定按钮
  const onOk = async () => {
    debugger
    if (actionType === 'copy') {
      console.log('复制助手');
    } else if (actionType === 'delete') {
      handleRemoveBrain(itemData)
    }
    modalRef.current.hideModal();
  }

  useEffect(() => {
    getMineBrain();
  }, [page_number]);


  const generateItems = (item) => [
    {
      key: '1',
      label: (<p onClick={() => brainEdit(item)}>编辑</p>),
    },
    {
      key: '2',
      label: (<p onClick={() => handleShowModal(item)}>删除</p>),
      open: item.reivew_status !== '审核中' || item.open !== 1 || item.status !== '上架'
    },
    {
      key: '3',
      label: (<p>分享至PC</p>),
      hidden: !item.is_share, // 控制隐藏
    },
    // {
    //   key: '7',
    //   label: (<p>分享</p>),
    //   open: !item.is_share, // 控制隐藏
    // },
    item.is_share && {
      key: '6',
      label: (<p>分享至小程序</p>),
    },
    {
      key: '4',
      label: (<p>转移</p>),
    },
    {
      key: '5',
      label: (<p onClick={() => handleCopy(item)}>复制</p>),
    },
  ];

  return (
    <div className='create-brain-list'>
      {mineCreateBrain.length === 0 && <div className="create-brain-empty">您还未创建智能体</div>}
      <CustomModal onOk={onOk} ref={modalRef} children={childrenType} />
      <div className='create-brain-list-wrapper'>
        {mineCreateBrain.map((item) => {
          return (
            <div className='create-brain-list-item' key={item.id}>
              <img className="mine-brain-bg" src={`${item.image_url || item.assistant_url}`} />
              <p className="text">{item.name || item.assistant_name}</p>
              {item.status === '草稿' && !item.is_delete && (<div className="create-timeimg">创建中</div>)}
              <div className="create-brain-chat-btn">
                {item.status === '草稿' && (<span></span>)}
                <div className='btn_list'>
                  <Dropdown menu={{ items: generateItems(item) }} trigger={['click']} className="custom-dropdown-menu" >
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
