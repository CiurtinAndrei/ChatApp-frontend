import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Admin from './routes/Admin';
import Page from './routes/Page';
import PhotoTest from './routes/PhotoTest';
import Login from './routes/Login';
import Register from './routes/Register';
import Logout from './routes/Logout';
import MainPage from './routes/MainPage';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>   

        <Route index element={<MainPage />} />
        <Route path="admin" element={<Admin />} />
        <Route path="page" element={<Page />} />
        <Route path = "phototest" element={<PhotoTest />} />
        <Route path = "login" element={<Login />} />
        <Route path = "register" element={<Register />} />
        <Route path = "logout" element={<Logout />} />
        </Route>
        
    )
  )

  export default router;