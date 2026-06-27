import React, { useEffect, useState } from 'react';
import { Button, Col, ConfigProvider, Form, Input, notification, Row } from 'antd';
import api from '../../api';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const form = Form.useFormInstance();
  const navigate = useNavigate();
  const [notificationInstance, contextHolder] = notification.useNotification();
  const [success, setSuccess] = useState(false)
  const onFinish = (values) => {
    api.register(values).then((res) => {
      Cookies.set('token', res.token)
      notificationInstance.success({
        message: 'register successful',
        description: 'redirect to index page',
        duration: 2,
        onClose () {
          setSuccess(true)
        }
      })
    }).catch(({ response }) => {
      notificationInstance.error({
        message: 'Error',
        description: response.data.error,
        duration: 2
      })
    })
  }
  const onFinishFailed = () => {

  }
  useEffect(() => {
    if (success) {
      navigate('/')
    }
  }, []);
  return (
        <>
            {contextHolder}
            <Row justify={'center'} className={'mt-10'}>
                <Col xs={24} sm={20} md={16} lg={12} xxl={8}>
                    <h1>Register</h1>
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
                            label="name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
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
                        <Form.Item
                            label="confirm-password"
                            name="confirmPassword"
                            rules={[{ required: true, message: 'Please input your password!' },
                              ({ getFieldValue }) => ({
                                validator (_, value) {
                                  if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('The confirm password that you entered do not match!'));
                                },
                              }),]}
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
                                    Submit
                                </Button>
                            </ConfigProvider>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

        </>
  )
}
export default RegisterPage
