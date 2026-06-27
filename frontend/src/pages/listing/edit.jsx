import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, InputNumber, notification, Row, Select, Space, Upload } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import utils from '../../utils';
import { UploadOutlined } from '@ant-design/icons';
import api from '../../api';

const EditListingPage = () => {
  const [fileList, setFileList] = useState([])
  const [fileList1, setFileList1] = useState([])
  const [form] = Form.useForm();
  const [notificationInstance, contextHolder] = notification.useNotification();
  const [isBack, setIsBack] = useState(false)
  const navigate = useNavigate();
  const { id } = useParams()
  console.log('>>>>>>>>>id', id)
  const onFinish = (values) => {
    console.log(values)
    const obj = {
      title: values.title,
      address: values.address,
      price: values.price,
      thumbnail: values.thumbnail,
      metadata: {
        amenities: values.amenities,
        bathrooms: values.bathrooms,
        bedrooms: values.bedrooms,
        property_type: values.property_type,
        room_image_list: values.room_image_list
      }
    }

    api.listing_update(id, obj).then((res) => {
      notificationInstance.success({
        message: 'Success',
        description: 'created success',
        duration: 2,
        onClose () {
          setIsBack(true)
        }
      })
    }).catch(({ response }) => {
      console.log('>>>>>>>>>>response', response)
      notificationInstance.error({
        message: 'Error',
        description: (response && response.data.error) || 'unknow error',
        duration: 2
      })
    })
  }
  const onFinishFailed = () => {

  }

  const handlerBeforeUpload = (file) => {
    utils.blobToBase64(file, (base64Data) => {
      setFileList([{
        name: file.name,
        thumbUrl: base64Data,
        url: base64Data
      }])
      form.setFieldValue('thumbnail', {
        name: file.name,
        url: base64Data
      })
    })
    return false
  }

  const handlerRemove = (file) => {
    setFileList([])
    form.setFieldValue('thumbnail', '')
    return false
  }

  const handlerRemove1 = (file) => {
    if (form.getFieldValue('room_image_list')) {
      setFileList1(fileList1.filter(item => item.url !== file.url))
      form.setFieldValue('room_image_list', form.getFieldValue('room_image_list').filter(item => item !== file.url))
    }

    return false
  }

  const handlerBeforeUpload1 = (file) => {
    utils.blobToBase64(file, (base64Data) => {
      setFileList1([...fileList1, {
        name: file.name,
        thumbUrl: base64Data,
        url: base64Data
      }])
      form.setFieldValue('room_image_list', [...fileList1.map(item => ({ name: item.name, url: item.url })) || [], {
        name: file.name,
        url: base64Data
      }])
    })
    return false
  }

  const fetchDetail = () => {
    api.listing_detail(id).then((res) => {
      console.log('>>>>>>>>detail', res.listing)
      form.setFieldValue('title', res.listing.title)
      form.setFieldValue('address', res.listing.address)
      form.setFieldValue('thumbnail', res.listing.thumbnail)
      setFileList([res.listing.thumbnail])
      form.setFieldValue('price', res.listing.price)
      form.setFieldValue('property_type', res.listing.metadata.property_type)
      form.setFieldValue('bathrooms', res.listing.metadata.bathrooms)
      form.setFieldValue('bedrooms', res.listing.metadata.bedrooms)
      form.setFieldValue('amenities', res.listing.metadata.amenities)
      form.setFieldValue('room_image_list', res.listing.metadata.room_image_list)
      setFileList1([...res.listing.metadata.room_image_list])
    })
  }

  useEffect(() => {
    if (isBack) {
      navigate('/listing')
    }
  }, [isBack]);
  useEffect(() => {
    fetchDetail()
  }, []);

  return (
        <>
            {contextHolder}
            <Row justify={'center'} className={'mt-10'}>
                <Col xs={24} sm={20} md={16} lg={12} xxl={8}>
                    <h1>Update</h1>
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
                            label="title"
                            name="title"
                            rules={[
                              { required: true, message: 'Please input your title!' }
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="address"
                            name="address"
                            rules={[{ required: true, message: 'Please input your address!' }]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="thumbnail"
                            name="thumbnail"
                            rules={[{ required: true, message: 'Please input your thumbnail!' }]}
                        >
                            <Upload onRemove={handlerRemove} fileList={fileList} accept={'image/*'} maxCount={1}
                                    beforeUpload={handlerBeforeUpload}>
                                <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label="price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your price!' }]}
                        >
                            <InputNumber
                                min="0"
                                step="0.01"
                                stringMode
                            />
                        </Form.Item>
                        <Form.Item
                            label="property_type"
                            name="property_type"
                            rules={[{ required: true, message: 'Please input your property_type!' }]}
                        >
                            <Select

                                style={{
                                  width: '100%',
                                }}
                                options={[
                                  {
                                    value: 'apartment',
                                    label: 'apartment',
                                  },
                                  {
                                    value: 'hotel',
                                    label: 'hotel',
                                  },
                                  {
                                    value: 'homestay',
                                    label: 'homestay',
                                  }
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label="bathrooms"
                            name="bathrooms"
                            rules={[{ required: true, message: 'Please input your bathrooms!' }]}
                        >
                            <InputNumber
                                min="0"
                                step="1"
                                stringMode
                            />
                        </Form.Item>
                        <Form.Item
                            label="bedrooms"
                            name="bedrooms"
                            rules={[{ required: true, message: 'Please input your bedrooms !' }]}
                        >
                            <InputNumber
                                min="0"
                                step="1"
                                stringMode
                            />
                        </Form.Item>
                        <Form.Item
                            label="amenities"
                            name="amenities"
                            rules={[{ required: true, message: 'Please input your bedrooms !' }]}
                        >
                            <Select
                                mode={'multiple'}
                                style={{
                                  width: '100%',
                                }}
                                options={[
                                  {
                                    value: 'wifi',
                                    label: 'wifi',
                                  },
                                  {
                                    value: 'swimming pool',
                                    label: 'swimming pool',
                                  },
                                  {
                                    value: 'TV',
                                    label: 'TV',
                                  },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label="room_image_list"
                            name="room_image_list"
                            rules={[{ required: true, message: 'Please input your room image list!' }]}
                        >
                            <Upload onRemove={handlerRemove1} fileList={fileList1} accept={'image/*'} maxCount={1}
                                    beforeUpload={handlerBeforeUpload1}>
                                <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit" block={true}>
                                    Submit
                                </Button>
                                <Button type="primary" onClick={() => {
                                  navigate('/listing')
                                }} block={true}>
                                    Back
                                </Button>
                            </Space>

                        </Form.Item>
                    </Form>
                </Col>
            </Row>

        </>
  )
}
export default EditListingPage
