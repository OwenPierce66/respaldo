import React from 'react';
import { Route, Routes } from 'react-router-dom'; // ✅ Switch → Routes
import Registration from './Registration';
import Subscription from './Subscription';
import SubscriptionSuccess from './SubscriptionSuccess';

const RegistrationNav = ({ match }) => {
  const { path } = match;

  return (
    <div>
      <Routes>
        <Route path={`${path}`} element={<Registration />} />
        <Route path={`${path}/subscription/:accountId`} element={<Subscription />} />
        <Route path={`${path}/subscriptionSuccess`} element={<SubscriptionSuccess />} />
      </Routes>
    </div>
  );
};

export default RegistrationNav;
