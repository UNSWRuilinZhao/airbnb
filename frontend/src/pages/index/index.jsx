import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Col, DatePicker, Empty, Flex, Image, Input, Modal, notification, Row, Slider } from 'antd';
import api from '../../api';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
function calculateAverage (arr) {
  if (arr.length === 0) {
    return 0;
  }

  const sum = arr.reduce((acc, val) => acc + val, 0);
  const average = sum / arr.length;

  return average.toFixed(2);
}
const IndexPage = () => {
  const [notificationInstance, contextHolder] = notification.useNotification();
  const originData = useRef(null)
  const [filterData, setFilterData] = useState([])
  const [queryParams, setQueryParams] = useState({
    title: '',
    minBedrooms: 0,
    maxBedRooms: 0,
    startDate: '',
    endDate: '',
    minPrice: '',
    maxPrice: ''
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const fetchData = async () => {
    try {
      const res = await api.listing_list()
      const result = []
      for (let i = 0; i < res.listings.length; i++) {
        const detail = await api.listing_detail(res.listings[i].id)
        detail.listing.rating = detail.listing.reviews && detail.listing.reviews.length > 0 ? calculateAverage(detail.listing.reviews.map(item => item.score)) : 0
        result.push({ ...detail.listing, id: res.listings[i].id, key: res.listings[i].id })
      }
      originData.current = result
      if (Cookies.get('token')) {
        // get current user booking
        const bookingListData = await api.booking_list()
        console.log('>>>>>>>>>>>bookingListData', bookingListData)
        const bookingList = bookingListData.bookings
        for (let index = 0; index < bookingList
          .length; index++) {
          const obj1 = bookingList[index]
          console.log(obj1.listingId)
          const matchingObj = originData.current.find(obj2 => obj2.id === parseInt(obj1.listingId))
          if (matchingObj) {
            matchingObj.other = obj1;
          }
        }
        console.log(originData.current)
        setFilterData([...originData.current])
      }
    } catch ({ response }) {
      notificationInstance.error({
        message: 'Error',
        description: response.data.error || response.statusText || ''
      })
    }
  }
  const handlerSearch = () => {
    console.log('>>>>>>>>>>>>filterData', filterData)
    console.log('>>>>>>>>>>>>queryParams', queryParams)
    if (queryParams.title) {
      setFilterData(originData.current.filter((item) => {
        return item.title.toLowerCase().includes(queryParams.title.toLowerCase()) || item.address.toLowerCase().includes(queryParams.title.toLowerCase())
      }))
      return
    }
    if (queryParams.minBedrooms) {
      setFilterData(originData.current.filter((item) => {
        return item.metadata.bedrooms >= queryParams.minBedrooms
      }))
      return;
    }
    if (queryParams.maxBedRooms) {
      setFilterData(originData.current.filter((item) => {
        return item.metadata.bedrooms <= queryParams.maxBedRooms
      }))
      return;
    }
    if (queryParams.startDate && queryParams.endDate) {
      setFilterData(originData.current.filter((item) => {
        return item.availability.some(_item => {
          return _item.startDate >= queryParams.startDate && _item.endDate <= queryParams.endDate
        })
      }))
      return;
    }

    if (queryParams.minPrice) {
      setFilterData(originData.current.filter((item) => {
        return item.price >= queryParams.minPrice
      }))
      return;
    }

    if (queryParams.maxPrice) {
      setFilterData(originData.current.filter((item) => {
        return item.price <= queryParams.maxPrice
      }))
      return;
    }

    setFilterData(originData.current)
  }

  const handleTime = (param) => {
    const givenTimestamp = new Date(param).getTime();
    const currentTimestamp = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((currentTimestamp - givenTimestamp) / oneDay));
    return diffDays
  }

  const handleTimeRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay));
    return diffDays
  }

  const handleProfit = (start, end, price) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay));
    return price * diffDays
  }

  useEffect(() => {
    fetchData()
  }, []);
  // sort
  const data = [...filterData].sort((a, b) => a.title.localeCompare(b.title)).filter(item => item.published);
  return (
        <>
            {contextHolder}
            <section className={'p-5'}>
                <Row className={'mb-2'} gutter={10}>
                    <Col span={24}>
                        <Button type={'primary'} onClick={() => {
                          setIsModalOpen(true)
                        }}>Filter</Button>
                    </Col>
                </Row>
                <Row gutter={10}>
                    {data && data.length > 0
                      ? data.map(item => {
                        return (
                            <Fragment key={item.id}>
                                <Col span={24} sm={12} md={8} lg={6} xl={4} className={'mb-2.5'}>
                                  <Link to={`/detail/${item.id}`}>
                                    <Flex vertical={true}>
                                      <div>
                                        <Image preview={false} alt={'image'} src={item.thumbnail.url}></Image>
                                      </div>
                                      <h3 className={'m-0 '}>{item.title}</h3>
                                      <Flex justify={'end'}>
                                        <div>reviews:({item.reviews.length || 0})</div>
                                      </Flex>
                                  <div className={'text-[#FF385C] font-bold'}>&nbsp;{item.price}&nbsp;RM/day</div>
                                  <div className={'text-[#FF385C] font-bold'}>Published for {handleTime(item.postedOn)} day</div>
                                  {item?.other
                                    ? <div style={{ marginTop: '5px' }}>
                                    Reservation information: <div className={'text-[#FF385C] font-bold'}>Scheduled: {item?.other?.status}</div>
                                    <div className={'text-[#FF385C] font-bold'}>Booked for {handleTimeRange(item?.other?.dateRange.startDate, item?.other?.dateRange.endDate)} days</div>
                                    <div className={'text-[#FF385C] font-bold'}>Profit earned: {handleProfit(item?.other?.dateRange.startDate, item?.other?.dateRange.endDate, item.price) + '$' }</div></div>
                                    : null
                                }
                                    </Flex>
                                  </Link>
                                </Col>
                            </Fragment>
                        )
                      })
                      : <Col span={24}>
                          <Empty />
                        </Col>
                    }

                </Row>
            </section>
            {/* filter */}
          {isModalOpen && <Modal forceRender={true} destroyOnClose={true} title="Filter Modal" open={isModalOpen} onOk={() => {
            setIsModalOpen(false)
            handlerSearch()
          }} onCancel={() => {
            setIsModalOpen(false)
          }} >
            <Row className={'mb-2'}>
              <Col span={24} className={'mb-2'}>
                <p className={'mb-2'}>Title:</p>
                <Input allowClear={true} value={queryParams.title} onChange={(e) => {
                  setQueryParams({
                    ...queryParams,
                    title: e.currentTarget.value
                  })
                }}></Input>
              </Col>
              <Col span={24} className={'mb-2'}>
                <p>Min Bedrooms:</p>
                <Slider defaultValue={0} max={10} value={queryParams.minBedrooms} onChange={(value) => {
                  setQueryParams({
                    ...queryParams,
                    minBedrooms: value
                  })
                }}/>
              </Col>
              <Col span={24} className={'mb-2'}>
                <p>Max Bedrooms:</p>
                <Slider defaultValue={0} max={10} value={queryParams.maxBedRooms} onChange={(value) => {
                  setQueryParams({
                    ...queryParams,
                    maxBedRooms: value
                  })
                }}/>
              </Col>
              <Col span={24} className={'mb-2'}>
                <p>Date Range:</p>
                <DatePicker.RangePicker className={'w-full'} onChange={(date, dateString) => {
                  console.log('<<<<<<datepicker', dateString)
                  setQueryParams({
                    ...queryParams,
                    startDate: dateString[0],
                    endDate: dateString[1]
                  })
                }}/>
              </Col>
              <Col span={24} className={'mb-2'}>
                <p>Min Price:</p>
                <Slider defaultValue={0} max={1000} value={queryParams.minPrice} onChange={(value) => {
                  setQueryParams({
                    ...queryParams,
                    minPrice: value
                  })
                }}/>
              </Col>
              <Col span={24} className={'mb-2'}>
                <p>Max Price:</p>
                <Slider defaultValue={0} max={1000} value={queryParams.maxPrice} onChange={(value) => {
                  setQueryParams({
                    ...queryParams,
                    maxPrice: value
                  })
                }}/>
              </Col>

            </Row>
          </Modal>}

        </>
  )
}
export default IndexPage
