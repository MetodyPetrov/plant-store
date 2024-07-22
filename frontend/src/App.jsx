import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import HomePage from './Pages/Home';
import NavigationBar from './Navigation/NavigationBar';
import AboutBushes from './Pages/AboutBushes';
import Store from './Purchase/Store';
import Auth from './Pages/Auth';

import Product from './Purchase/Product';

import './App.css';
import Account from './Pages/Account';
import Cart from './Purchase/Cart';
import Error from './Pages/Error';
import { queryClient } from './utils/http';

const router = createBrowserRouter([
  {
    path: '/',
    element: <NavigationBar />,
    errorElement: <Error />, 
    children: [
      { index: true, element: <Navigate to="/home" /> },
      { path: '/home', element: <HomePage /> },
      { path: '/store', element: <Store />},
      { path: '/store/:productId', element: <Product />},

      { path: '/authenticate', element: <Auth />},
      { path: '/account', element: <Account />} ,

      { path: '/cart', element: <Cart />},

      { path: '/bushes', element: <AboutBushes /> }
    ]
  }
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
    </QueryClientProvider>
  );
}