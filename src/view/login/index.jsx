import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Form, Col, Row } from 'antd';
import { useNavigate, } from 'react-router-dom';

import { login } from "@/apis/login"
import useMessage from '@/utils/useMessage';
import newLogo from '../../assets/image/svg/new-logo.svg'
import loginBg from '../../assets/image/svg/login-bg.svg'
import './index.scss'

const privacy = '《隐私政策》';
const userAgreement = '《用户协议》';

const clickUserAgreement = () => {
  console.log('跳转页面');
}


const clickPrivacy = () => {
  console.log('跳转页面');
}

const validatePhoneNumber = () => ({
  required: true,
  message: '请输入手机号',
  validator: (_, value) => {
    const phoneRegex = /^1[3-9]\d{9}$/; // 简单校验中国大陆手机号
    if (!value) {
      return Promise.reject(new Error('请输入手机号'));
    }
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error('请输入合法的手机号'));
    }
    return Promise.resolve();
  },
});

const createValidator = () => ({
  required: true,
  message: '请输入验证码',
  validator: (_, value) => {
    return new Promise((resolve, reject) => {
      if (!value) {
        reject(new Error('请输入验证码'));
      } else if (value.length !== 6 || isNaN(Number(value))) {
        reject(new Error('验证码必须为6位数字'));
      } else {
        resolve(); // 验证成功
      }
    });
  },
});

const Login = () => {
  const { warning } = useMessage();
  const navigate = useNavigate(); // 导航方法
  const onFinish = async (value) => {
    try {
      const { code, data, msg } = await login(value);
      if (code === 200) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('ratuBrainUserInfo', JSON.stringify(data))
        navigate('/brain/brainStore')
      } else {
        warning(msg)
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='login-wrapper'>
      <Row style={{ height: '100vh' }}>
        <Col flex={1}>
          <Row>
            <Col flex={1}>
              <div className="position-relative">
                <img className="login-logo" src={newLogo} alt="logo" />
              </div>
            </Col>
            <Col flex={1}>
              <div className='loginBg-wrapper'>
                <img className="loginBg" src={loginBg} alt="logo" />
              </div>
            </Col>
          </Row>
        </Col>
        <Col flex={3}>
          <Card style={{ height: '100%', width: '100%' }}>
            <div className='login-from'>
              <h1>欢迎使用 Ratubrain</h1>
              <h4>Brain 管理控制面板</h4>
              <Form className='login-form' name='login' autoComplete="off" onFinish={onFinish}>
                <Form.Item
                  name="phone_number"
                  label="手机号"
                  rules={[validatePhoneNumber()]}
                >
                  <Input className='login-input' placeholder="请输入手机号" />
                </Form.Item>
                <Form.Item
                  name="phone_code"
                  label="验证码"
                  rules={[createValidator()]}
                >
                  <Input className='login-input' placeholder="请输入验证码" />
                </Form.Item>
                <div className='' style={{ marginTop: '130px' }}>
                  注册或登录即表示阅读并同意 <span onClick={clickUserAgreement} style={{ color: '#000', cursor: 'pointer' }}>{userAgreement}</span>及<span onClick={clickPrivacy} style={{ color: '#000', cursor: 'pointer' }}>{privacy}</span>
                </div>
                <Form.Item style={{ marginTop: '20px' }}>
                  <Button className='login-button' type="primary" htmlType='submit' >登录</Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Col>
      </Row >

    </div >
  )
};

export default Login;