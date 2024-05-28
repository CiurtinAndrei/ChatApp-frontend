import React from 'react';
import "./css/bootstrap.css"
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import router from './Routes.jsx';

function App({Routes}) {

  return (
    <div> 
        <div>
          
         <>
           <RouterProvider router={router}/>
         </>

        </div>
    </div>


    );


}

export default App;