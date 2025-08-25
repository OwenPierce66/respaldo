import React from 'react';
import { useSelector } from 'react-redux';

const RaffleCheckoutSuccess = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <h1>Thank You {user.username}! You have successfully entered for the raffle!</h1>
      <h2>Contact AD found on contact page if you have any questions.</h2>
      <br/>
      <h2>You can find your Raffle Tickets by clicking on MyTickets at the <a href="/dashboard">Dashboard</a> or <a href="/dashboard/raffle">Raffle</a> page.</h2>
    </div>
  )
}

export default RaffleCheckoutSuccess;