import React, { useEffect, useState } from 'react';
import { Button, Col, ConfigProvider, Form, Input, notification, Row } from 'antd';
import api from '../../api';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { setToken, setUserInfo } from '../../store/modules/user';
import { useDispatch } from 'react-redux';

const LoginPage = () => {
  const form = Form.useFormInstance();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notificationInstance, contextHolder] = notification.useNotification();
  const [loginSuccess, setLoginSuccess] = useState(false)
  const onFinish = (values) => {
    api.login(values).then((res) => {
      Cookies.set('token', res.token)
      Cookies.set('owner', values.email)
      dispatch(setToken({ token: res.token }))
      dispatch(setUserInfo({ userInfo: values.email }))
      notificationInstance.success({
        message: 'Successful',
        description: 'Redirecting to main page',
        duration: 2,
        onClose () {
          setLoginSuccess(true)
        }
      })
    }).catch(({ response }) => {
      notificationInstance.error({
        message: 'Error',
        description: response.data.error,
        duration: 2,
      })
    })
  }
  const onFinishFailed = () => {

  }
  useEffect(() => {
    if (loginSuccess) {
      navigate('/')
    }
  }, [loginSuccess]);
  return (
        <>
            {contextHolder}
            <Row justify={'center'} className={'mt-10'}>
                <Col xs={24} sm={20} md={16} lg={12} xxl={8}>
                    <h1>Login</h1>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 12 }}
                        wrapperCol={{ span: 24 }}
                        layout={'vertical'}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="email"
                            name="email"
                            rules={[
                              { required: true, message: 'Please input your email!' },
                              { type: 'email', message: 'Incorrect email format' }
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item>
                            <ConfigProvider
                                theme={{
                                  token: {
                                    colorPrimary: '#FF385C',
                                    borderRadius: 2,
                                    colorBgContainer: '#f6ffed',
                                  },
                                }}
                            >

                                <Button type="primary" htmlType="submit" block={true}>
                                    Login
                                </Button>
                            </ConfigProvider>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

        </>
  )
}
export default LoginPage
