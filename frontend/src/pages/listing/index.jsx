import React, { useEffect, useState } from 'react';
import { Button, Col, Image, Modal, notification, Popconfirm, Row, Space, Table, DatePicker, Flex } from 'antd';
import api from '../../api';
import { Link } from 'react-router-dom';
function calculateAverage (arr) {
  if (arr.length === 0) {
    return 0;
  }

  const sum = arr.reduce((acc, val) => acc + val, 0);
  const average = sum / arr.length;

  return average.toFixed(2);
}
const { RangePicker } = DatePicker;
const ListingListPage = () => {
  const [data, setData] = useState([])
  const [notificationInstance, contextHolder] = notification.useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [dateAvaiable, setDateAvaialbe] = useState([{
    start: '',
    end: ''
  }])
  const columns = [
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'property type',
      dataIndex: 'propertyType',
      key: 'propertyType',
      render (text, record, index) {
        return (
                    <>
                        <div>{record.metadata.property_type}</div>
                    </>
        );
      }
    },
    {
      title: 'bedrooms',
      dataIndex: 'bedrooms',
      key: 'bedrooms',
      render (text, record, index) {
        return (
                    <>
                        <div>{record.metadata.bedrooms}</div>
                    </>
        );
      }
    },
    {
      title: 'bathrooms',
      dataIndex: 'bathrooms',
      key: 'bathrooms',
      render (text, record, index) {
        return (
                    <>
                        <div>{record.metadata.bathrooms}</div>
                    </>
        );
      }
    },
    {
      title: 'address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render (text) {
        return text && <Image alt={'image'} width={60} src={text.url}></Image>
      }

    },
    {
      title: 'SVG rating',
      dataIndex: 'rating',
      render (text, record, index) {
        return record.reviews && record.reviews.length > 0 ? calculateAverage(record.reviews.map(item => item.score)) : 0;
      }
    },
    {
      title: 'reviews',
      dataIndex: 'reviews',
      render (text, record, index) {
        return (
            <>
              {record.reviews.length || 0}
            </>
        );
      }

    },
    {
      title: 'price',
      dataIndex: 'price',

    },
    {
      title: 'action',
      dataIndex: 'action',
      render (text, record, index) {
        console.log(record)
        return (
                    <>
                        <Space size={10}>
                            <Popconfirm
                                title="Delete the record"
                                description="Are you sure to delete this record?"
                                onConfirm={() => delConfirm(record)}
                                onCancel={decCancel}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type={'primary'}>delete</Button>
                            </Popconfirm>
                            {/* publish or  unpublish button */}
                            {record.published
                              ? <Popconfirm
                                title="unpublish the record"
                                description="Are you sure to unpublish this record?"
                                onConfirm={() => {
                                  unpublish(record)
                                }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type={'primary'}>unpublish</Button>
                            </Popconfirm>
                              : <Button type={'primary'} onClick={() => {
                                setCurrentRecord(record)
                                setIsModalOpen(true)
                              }}>publish</Button>}
                            <Link to={`/listing-edit/${record.id}`}>
                                <Button type={'primary'}>edit</Button>
                            </Link>
                        </Space>

                    </>
        )
      }

    },
  ];
  const delConfirm = (record) => {
    api.listing_del(record.id).then(() => {
      notificationInstance.success({
        message: 'Success',
        description: 'delete complete!',
        duration: 2,
        onClose () {
          fetchData()
        }
      })
    }).catch(({ response }) => {
      notificationInstance.error({
        message: 'Error',
        description: response.data.error || response.statusText || ''
      })
    })
  }
  const decCancel = (record) => {

  }
  const fetchData = async () => {
    try {
      const res = await api.listing_list()
      console.log('>>>>>>>res', res)
      const result = []
      for (let i = 0; i < res.listings.length; i++) {
        const detail = await api.listing_detail(res.listings[i].id)
        result.push({ ...detail.listing, id: res.listings[i].id, key: res.listings[i].id })
      }
      console.log('>>>>>>>>>result', result)
      setData(result)
    } catch ({ response }) {
      notificationInstance.error({
        message: 'Error',
        description: response.data.error || response.statusText || ''
      })
    }
  }
  const unpublish = (record) => {
    api.listing_unpublish(record.id).then(() => {
      fetchData()
      notificationInstance.success({
        message: 'Success',
        description: 'unpublish complete',
        duration: 2
      })
    }).catch((response) => {
      notificationInstance.error({
        message: 'Error',
        description: response.data.error || response.statusText || ''
      })
    })
  }
  const handleOk = () => {
    console.log(currentRecord, dateAvaiable)
    if (!dateAvaiable || dateAvaiable.length === 0) {
      notificationInstance.error({
        message: 'Error',
        description: 'need  input strat date or end date'
      })
      return
    }
    dateAvaiable.forEach((item) => {
      if (!/.+/.test(item.start) || !/.+/.test(item.end)) {
        notificationInstance.error({
          message: 'Error',
          description: 'need  input strat date or end date'
        })
      }
    })
    api.listing_publish(currentRecord.id, {
      availability: [
        ...dateAvaiable.map(item => {
          return { strat: item.start, end: item.end }
        })
      ]
    }).then(() => {
      setIsModalOpen(false)
      fetchData()
      notificationInstance.success({
        message: 'Success',
        description: 'publish complete',
        duration: 2
      })
    }).catch(({ response }) => {
      notificationInstance.error({
        message: 'Error',
        description: response.data.error || response.statusText || ''
      })
    })
  }
  const handlerDateChange = (date, [start, end], index) => {
    setDateAvaialbe(dateAvaiable.map((item, _index) => {
      if (index === _index) {
        item.start = start
        item.end = end
        item.date = date
      }
      return item
    }))
  }
  useEffect(() => {
    fetchData()
  }, []);
  return (
        <>
            {contextHolder}
            <section className={'p-5'}>
                <Row className={'mb-2'}>
                    <Col span={24}>
                        <Link to={'/listing-create'}>
                            <Button type={'primary'}>Create</Button>
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table dataSource={data} columns={columns}/>;
                    </Col>
                </Row>
            </section>

            <Modal title="Publish Modal" open={isModalOpen} onOk={handleOk} onCancel={() => {
              setIsModalOpen(false)
              setCurrentRecord(null)
              setDateAvaialbe([{ start: '', end: '', date: null }])
            }}>
                <Row>
                    <Col span={24} className={'mb-2'}>
                        <Button type={'primary'} onClick={() => {
                          setDateAvaialbe([
                            ...dateAvaiable, {
                              start: '', end: '', date: null,
                            }
                          ])
                        }}>Add Date Range</Button>
                    </Col>
                    {dateAvaiable && dateAvaiable.map((value, index, array) => {
                      return (
                            <Col span={24} className={'mb-2'} key={index}>
                                <Flex>
                                    <RangePicker value={value.date} className={' w-full'}
                                                 onChange={(date, dateString) => {
                                                   handlerDateChange(date, dateString, index)
                                                 }}></RangePicker>
                                    <Button type={'link'} className={'ml-2'} onClick={() => {
                                      setDateAvaialbe(dateAvaiable.filter((_item) => {
                                        return _item !== value
                                      }))
                                    }}>delete</Button>
                                </Flex>
                            </Col>
                      )
                    })}

                </Row>
            </Modal>
        </>
  )
}
export default ListingListPage
