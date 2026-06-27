import React from 'react';
import ReactDOM from 'react-dom';

import 'normalize.css'
import './assets/style/main.css'
import App from './App';
import { ConfigProvider } from 'antd'

ReactDOM.render(
    <React.StrictMode>
        <ConfigProvider theme={{
          token: {
            colorPrimary: '#FF385C'
          }
        }}>
            <App></App>
        </ConfigProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
