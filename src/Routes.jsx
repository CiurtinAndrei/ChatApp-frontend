import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Home from './routes/Home';
import Page from './routes/Page';
import Test from './routes/Test';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>   

        <Route index element={<Home />} />
        <Route path="page" element={<Page />} />
        <Route path = "test" element={<Test />} />
        </Route>
        
    )
  )

  export default router;