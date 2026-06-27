import axios from 'axios';
import Cookies from 'js-cookie';
// import { notification } from 'antd';

const instance = axios.create({
  baseURL: '/api',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' }
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (Cookies.get('token')) {
    config.headers.set('Authorization', 'Bearer ' + Cookies.get('token'))
  }
  return config;
}, function (error) {
  // notification.error({
  //   message: 'error',
  //   description: error.request.message,
  // })
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  if (response.status === 200) {
    return response.data;
  }
  return Promise.reject(new Error(response.data.error))
}, function (error) {
  // notification.error({
  //   message: 'error',
  //   description: response.data.error,
  // })
  return Promise.reject(error)
});
export default instance;
