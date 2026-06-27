import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { Button, Carousel, Col, DatePicker, Empty, Flex, Image, Input, notification, Radio, Row, Space, } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'

import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
function calculateAverage (arr) {
  if (arr.length === 0) {
    return 0;
  }

  const sum = arr.reduce((acc, val) => acc + val, 0);
  const average = sum / arr.length;

  return average.toFixed(2);
}
const DetailPage = () => {
  const [notificationInstance, contextHolder] = notification.useNotification();
  const [detail, setDetail] = useState(null)
  const { id } = useParams()
  const token = useSelector(state => state.user.token)
  const userInfo = useSelector(state => state.user.userInfo)
  const [form, setForm] = useState({
    startDate: '',
    endDate: ''
  })
  const [reviewForm, setReviewForm] = useState({
    score: '',
    content: ''
  })
  const fetchData = async (id) => {
    const result = await api.listing_detail(id)
    //   call api  by login
    if (Cookies.get('token')) {
      const bookResult = await api.booking_list()
      result.listing.bookings = [...bookResult.bookings.filter((item) => item.listingId.toString() === id.toString() && userInfo === item.owner)]
    }
    console.log('>>>>>>>>>>>>>>>>>>detail', result.listing)
    setDetail(result.listing)
  }
  const handlerBooking = () => {
    if (!form.startDate || !form.endDate) {
      notificationInstance.error({
        message: 'Error',
        description: 'Please input stratDate or  endDate'
      })
      return
    }
    if (!Cookies.get('token')) {
      notificationInstance.error({
        message: 'Error',
        description: 'Login is required to use'
      })
      return
    }
    const days = dayjs(form.endDate).diff(dayjs(form.startDate), 'day')
    api.booking_now(id, {
      dateRange: { ...form },
      totalPrice: detail.price * days
    }).then((res) => {
      notificationInstance.success({
        message: 'Successful',
        description: 'Booking success!'
      })
      fetchData()
    }).catch(({ response }) => {
      notificationInstance.error({
        message: 'Error',
        description: response.data.error || response.statusText || ''
      })
    })
  }

  const handlerReview = () => {
    if (!Cookies.get('token')) {
      notificationInstance.error({
        message: 'Error',
        description: 'Login is required to use'
      })
      return
    }
    if (!/\w/.test(reviewForm.score) || !/\w/.test(reviewForm.content)) {
      notificationInstance.error({
        message: 'Error',
        description: 'Score or Content must be required'
      })
      return
    }
    console.log(reviewForm)
    api.booking_review(id, detail.bookings[0].id, {
      review: {
        score: reviewForm.score,
        content: reviewForm.content
      }
    }).then((res) => {
      fetchData(id)
      notificationInstance.success({
        message: 'Successful',
        description: 'Review success!'
      })
    }).catch(({ response }) => {
      notificationInstance.error({
        message: 'Error',
        description: response.data.error || response.statusText || ''
      })
    })
  }
  useEffect(() => {
    fetchData(id)
  }, []);

  return (
        <>
            {contextHolder}
            <section>
                <Row>
                    <Col span={24}>
                        <Carousel arrows prevArrow={<LeftOutlined/>} nextArrow={<RightOutlined/>}>
                            {detail && detail.metadata.room_image_list && detail.metadata.room_image_list.length > 0 && detail.metadata.room_image_list.map((item, index) => {
                              return (
                                    <div key={index} className={'w-full h-[600px] '}>
                                        <Image className={'object-cover'} preview={false} src={item.url} width={'100%'}
                                               height={'600px'} alt={'room_list'}></Image>
                                    </div>
                              )
                            })}
                        </Carousel>

                    </Col>
                </Row>
                <Row justify={'center'}>
                    <Col span={24} md={20} lg={18}>
                        <h1>Title:{detail && detail.title}</h1>
                        <h3>Address:{detail && detail.address}</h3>
                        <h3>Amenities:</h3>
                        <Flex>
                            <Space>
                                {detail && detail.metadata.amenities.map((item, index) => {
                                  return (
                                        <div key={index}><Button type={'primary'} size={'normal'} ghost={true}>{item}</Button></div>
                                  )
                                })}
                            </Space>
                        </Flex>
                        <h3>Price:{detail && detail.price}RM/day</h3>
                        <h3>Number of bedrooms:{detail && detail.metadata.bedrooms}</h3>
                        <h3>Number of bathrooms:{detail && detail.metadata.bathrooms}</h3>
                        <h3>Review rating:{detail && detail.reviews.length > 0 ? calculateAverage(detail.reviews.map(item => item.score)) : 0}</h3>
                        <h3>Reviews:</h3>
                        {detail && detail.reviews.length > 0 && detail.reviews.map((item, index) => {
                          return (
                                <div key={index} className={'mb-2'}>
                                    <div>Score:{item.score}</div>
                                    <div>Content:{item.content}</div>
                                </div>
                          )
                        })}
                    </Col>
                </Row>
                <Row justify={'center'}>
                    <Col span={24} md={20} lg={18}>
                        <h3>Booking Now：</h3>
                        <div>
                            <DatePicker.RangePicker onChange={(data, dataString) => {
                              setForm({
                                startDate: dataString[0],
                                endDate: dataString[1]
                              })
                            }}/>
                            <Button type={'primary'} className={'ml-2'} onClick={handlerBooking}>booking now</Button>
                        </div>
                    </Col>
                </Row>
                {token && <Row justify={'center'}>
                    <Col span={24} md={20} lg={18}>
                        <h3>My Booking List：</h3>
                        {(detail && detail.bookings.length > 0)
                          ? detail.bookings.map((item) => {
                            return (
                                <div key={item.id} className={'mb-1'}>
                                    <div>Strat Date:{item.dateRange.startDate}</div>
                                    <div>End Date:{item.dateRange.endDate}</div>
                                    <div>Price:{item.totalPrice}RM</div>
                                    <div>Status:{item.status}</div>
                                </div>
                            )
                          })
                          : <Empty></Empty>}

                    </Col>
                </Row>}
                <Row justify={'center'}>
                    <Col span={24} md={20} lg={18}>
                        <h3>Review Now：</h3>
                        <Flex vertical={true}>
                            <div className={'mb-2'}>
                                <span>score：</span>
                                <Radio.Group onChange={(e) => {
                                  setReviewForm({
                                    ...reviewForm,
                                    score: e.target.value
                                  })
                                }} value={reviewForm.score}>
                                    <Radio value={1}>1</Radio>
                                    <Radio value={2}>2</Radio>
                                    <Radio value={3}>3</Radio>
                                    <Radio value={4}>4</Radio>
                                    <Radio value={5}>5</Radio>
                                </Radio.Group>
                            </div>
                            <div className={'mb-2'}>
                                <Input.TextArea value={reviewForm.content} onChange={(e) => {
                                  setReviewForm({
                                    ...reviewForm,
                                    content: e.currentTarget.value
                                  })
                                }}></Input.TextArea>

                            </div>
                            <div className={'mb-2'}>
                                <Button type={'primary'} onClick={handlerReview}>Review now</Button>
                            </div>
                        </Flex>
                    </Col>
                </Row>
            </section>
        </>
  )
}
export default DetailPage
