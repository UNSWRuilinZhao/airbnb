import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from './store/index'
import routes from './routes';
function App () {
  return (
      <Provider store={store}>
        <RouterProvider router={routes}></RouterProvider>
      </Provider>
  );
}

export default App;
