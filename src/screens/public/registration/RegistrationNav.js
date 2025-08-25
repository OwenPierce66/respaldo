import React from 'react';
import { Route, Switch } from 'react-router';
import Registration from './Registration';
import Subscription from './Subscription';
import SubscriptionSuccess from './SubscriptionSuccess';

const RegistrationNav = ({ match }) =>{
  const { path, url } = match;

  return <div>
    <Switch>
      <Route exact path={`${path}`} component={Registration} />
      <Route path={`${path}/subscription/:accountId`} component={Subscription} />
      <Route path={`${path}/subscriptionSuccess`} component={SubscriptionSuccess} />
    </Switch>
  </div>
}

export default RegistrationNav;