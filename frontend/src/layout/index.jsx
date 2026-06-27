import React, { useEffect } from 'react';
import { Button, Dropdown, Flex, Layout, notification } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import icon from '../assets/images/icon.svg'
import menu from '../assets/images/menu.svg'
import user from '../assets/images/user.svg'
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUserInfo } from '../store/modules/user';
import Cookies from 'js-cookie';
import api from '../api';

export default function LayoutPage () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(state => state.user.token)
  const [notificationInstance, contextHolder] = notification.useNotification();
  const menuList = !token
    ? [
        {
          key: '1',
          label: (
                    <Link to={'/login'}>
                        <Button type="text" className={' w-[200px]'}>
                            <span>Login</span>
                        </Button>
                    </Link>
          ),
        },
        {
          key: '2',
          label: (
                    <Link to={'/register'}>
                        <Button type="text" className={' w-[200px]'}>
                            <span>Register</span>
                        </Button>
                    </Link>
          ),
        },
      ]
    : [
        // {
        //   key: '1',
        //   label: (
        //
        //             <Link to={'/booking'}>
        //                 <Button type="text" onClick={onLoginOut.bind(this)} className={' w-[200px]'}>
        //                     <span className={'text-[#333]'}>booking list</span>
        //                 </Button>
        //             </Link>
        //
        //   ),
        // },
        {
          key: '2',
          label: (

              <Link to={'/listing'}>
                  <Button type="text" onClick={onLoginOut.bind(this)} className={' w-[200px]'}>
                      <span className={'text-[#333]'}>Listing list</span>
                  </Button>
              </Link>
          ),
        },
        {
          key: '3',
          label: (

                    <Button type="link" onClick={onLoginOut.bind(this)} className={' w-[200px]'}>
                        <span className={'text-[#333]'}>Logout</span>
                    </Button>
          ),
        },
      ]

  async function onLoginOut (event) {
    await api.loginOut()
    dispatch(setToken({ token: null }))
    Cookies.remove('token')
    Cookies.remove('owner')
    navigate('/login')
    notificationInstance.success({
      message: 'successful',
      duration: 1.5,
      description: 'Login out'
    })
  }

  useEffect(() => {
    if (Cookies.get('token')) {
      console.log('>>>>>>>>dispath token')
      dispatch(setToken({ token: Cookies.get('token') }))
      dispatch(setUserInfo({ userInfo: Cookies.get('owner') }))
    }
  }, []);

  return (
        <>
            {contextHolder}
            <Layout>
                <Layout.Header className={'bg-[#fff] border-solid border-b border-0 border-gray-200'}>
                    <Flex justify={'space-between'} className={'h-full '}>
                        <Flex align={'center'}>
                            <img alt={'icon'} src={icon} className={' h-[30px] cursor-pointer '} onClick={() => {
                              navigate('/')
                            }}/>
                        </Flex>
                        <div className={'flex items-center '}>
                            <Dropdown trigger={['click']} menu={{ items: menuList }}>
                                <div
                                    onClick={event => event.preventDefault()}
                                    className={'cursor-pointer flex justify-center items-center px-4 py-2 rounded-full border-[1px] border-gray-200 border-solid'}>
                                    <img alt={'menu'} src={menu} className={' h-[15px] mr-3 '}/>
                                    <img alt={'user'} src={user} className={' h-[30px] '}/>
                                </div>
                            </Dropdown>
                        </div>
                    </Flex>
                </Layout.Header>

                <Layout.Content className={'bg-[#fff] '}>
                    <Outlet></Outlet>
                </Layout.Content>
                <Layout.Footer className={'bg-[#fff] '}>

                </Layout.Footer>
            </Layout>
        </>
  )
}
