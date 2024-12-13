import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, Button } from "antd";

const CustomModal = forwardRef(({ title = '提示', cancelText = '取消', okText = '确定', width = 520, onOk, children }, ref) => {
  const [open, setOpen] = useState(false);

  // 暴露 showModal 和 hideModal 方法给父组件
  useImperativeHandle(ref, () => ({
    showModal: () => {
      setOpen(true);
    },
    hideModal: () => {
      setOpen(false);
    }
  }));

  const cancel = () => {
    setOpen(false);
  }

  return (
    <Modal
      open={open}
      title={title}
      width={width}
      onOk={onOk}
      onCancel={cancel}
      footer={[
        <Button key="cancel" onClick={cancel}>
          {cancelText}
        </Button>,
        <Button key="ok" type="primary" onClick={onOk}>
          {okText}
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
});

export default CustomModal;
