import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Home from './routes/Home';
import Page from './routes/Page';
import Test from './routes/Test';
import Login from './routes/Login';
import Register from './routes/Register';
import Logout from './routes/Logout';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>   

        <Route index element={<Home />} />
        <Route path="page" element={<Page />} />
        <Route path = "test" element={<Test />} />
        <Route path = "login" element={<Login />} />
        <Route path = "register" element={<Register />} />
        <Route path = "logout" element={<Logout />} />
        </Route>
        
    )
  )

  export default router;