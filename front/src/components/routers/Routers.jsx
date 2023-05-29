import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {JobOffer, MainPage, Auth, Canceled, Success, PriceTable} from '../pages/index';

export const useRoutes = (isAuthenticated) =>{
  
  return (
    <Routes>
      <Route path='/main' exact element={<MainPage/>} />
      {isAuthenticated && <Route path='/joboffer' exact element={<JobOffer/>} />}
      <Route path='/auth' exact element={<Auth/>} />
      {isAuthenticated && <Route path='/price' exact element={<PriceTable/>} />}
      <Route path="/*" element={<Navigate replace to="/main" />} />
      {isAuthenticated && <Route path="/canceled" exact element={<Canceled />} />}
      {isAuthenticated && <Route
        path="/success/:key/:time/:days"
        exact
        element={<Success />}
      />}
    </Routes>
  )
} 