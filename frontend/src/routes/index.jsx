import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import IndexPage from '../pages/index/index'
import LoginPage from '../pages/login/index'
import RegisterPage from '../pages/register/index'
import LayoutPage from '../layout/index'
import BookingListPage from '../pages/booking/index'
import ListingListPage from '../pages/listing';
import CreateListingPage from '../pages/listing/create';
import EditListingPage from '../pages/listing/edit';
import DetailPage from '../pages/detail';

const route = createBrowserRouter([
  {
    path: '/',
    element: <LayoutPage/>,
    children: [
      {
        path: '',
        element: <IndexPage></IndexPage>
      },
      {
        path: 'login',
        element: <LoginPage></LoginPage>
      },
      {
        path: 'register',
        element: <RegisterPage></RegisterPage>
      },
      {
        path: 'booking',
        element: <BookingListPage></BookingListPage>
      },
      {
        path: 'listing',
        element: <ListingListPage></ListingListPage>
      },
      {
        path: 'listing-create',
        element: <CreateListingPage></CreateListingPage>
      },
      {
        path: 'listing-edit/:id',
        element: <EditListingPage></EditListingPage>
      }, {
        path: 'detail/:id',
        element: <DetailPage></DetailPage>
      }
    ]
  }
])
export default route;
