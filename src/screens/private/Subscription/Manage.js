import React, { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { loadStripe } from "@stripe/stripe-js";
import Axios from "axios";
import { connect, useDispatch } from "react-redux";
import Breadcrumbs from "../../misc/Breadcrumbs";
import { formatMoney } from "../../../utils/Number";
import {updateSubscription} from "../../../store/actions/auth";

function Manage({ user, subscription }) {
  const [processing, setProcessing] = useState(false)

  const redirectToStripeCheckout = async (ID) => {
    setProcessing(true)

    const stripe = await loadStripe(
      "pk_test_51GrtUoHuoQnP408hk6dnSJKGungKZi3NqsYBBKhx2BJnzKpX0MMNuLOxXKTRleXogSS4tQghf4ZSsqDodxOuZZTz006S8g1HjE"
    );

    Axios.post("http://127.0.0.1:8000/api/create-checkout-session/", {
      priceId: ID,
      userId: user.id,
    }).then(res => {
      stripe.redirectToCheckout({ sessionId: res.data.sessionId });
    }).catch(e => {
      console.log(e)
      setProcessing(false)
    })
  };

  const plans = {
    monthly: { price: 8, duration: 'month', title: 'Monthly', priceId: 'price_1IO6aRHuoQnP408hcj01IfAr' },
    yearly: { price: 55, duration: 'year', title: 'Yearly', priceId: 'price_1IO6aRHuoQnP408hdes0m0lW' }
  }

  return (
    <div>
      <div className="profile-breadcrumbs">
        <Breadcrumbs crumbs={[
          { label: 'Profile', to: '/dashboard/profile' },
          { label: 'Manage Subscription' }
        ]} />
      </div>
      <h2 className="manage-subscription-header">
        Manage Subscription
      </h2>
      <CurrentSubscription subscription={subscription} />
      {!!subscription.plan && <ChangePlan subscription={subscription} />}
      <div className="Subscription">
        {(!subscription.active || (!!subscription.plan && subscription.plan.interval !== 'month')) &&
          <PriceCard {...plans.monthly} redirectToStripeCheckout={redirectToStripeCheckout} processing={processing} />
        }
        {(!subscription.active || (!!subscription.plan && subscription.plan.interval !== 'year')) &&
          <PriceCard {...plans.yearly} redirectToStripeCheckout={redirectToStripeCheckout} processing={processing} />
        }
      </div>
    </div>
  );
};

function CurrentSubscription({ subscription }) {
  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  const cancelSubscription = () => {
    setProcessing(true)

    Axios.delete(
      "http://127.0.0.1:8000/api/subscription/",
      { headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` } }
    ).then((res) => {
        dispatch(updateSubscription(res.data.subscription))
    }).catch(e => {
        setProcessing(false)
        console.log(e)
        setError("We're having some issues completing your request right now, please try again later.")
    })
  }

  if (error) {
    return <p className="error">{error}</p>
  }

  if (subscription.type === 'free') {
    return <p className="inactive-subscription-description">You've been granted a free account, so there's no need to manage any subscriptions.</p>
  }

  if (subscription.type === 'admin') {
    return <p className="inactive-subscription-description">You're an admin, so theres no need to manage any subscriptions.</p>
  }

  if (subscription.active) {
    return (
      <div className="current-subscription-container">
        <div className="current-subscription-information">
          <div className="current-subscription-header-container">
            <p className="current-subscription-header">Current Subscription</p>
            {subscription.type === 'trial' && (
              <p className="current-subscription-trial">Trial</p>
            )}
          </div>
          <p className="current-subscription-price">
            {formatMoney(subscription.plan.amount / 100)} per {subscription.plan.interval}
          </p>
          {/* Stripe API uses unix timestamps which are in seconds, while the Date constructor expects milliseconds. */}
          <p className="current-subscription-end">
            Your plan renews on {new Date(subscription.end * 1000).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button type="button" className="current-subscription-cancel" onClick={cancelSubscription}>Cancel</button>
      </div>
    )
  }
        
  return <p className="inactive-subscription-description">You currently don't have an active subscription, you can pick from one of our options below.</p>
}

function ChangePlan({ subscription }) {
  let description = 'Our yearly plan offers all the same benefits but with long term savings.'

  if (subscription.plan.interval === 'year') {
    description = 'Our monthly plan offers all the same benefits but more flexibility.'
  }
  
  return (
    <Fragment>
      <h3 className="change-plan-header">
        Change plan
      </h3>
      <p className="change-plan-description">{description}</p>
    </Fragment>
  )
}

function PriceCard({ price, duration, title, priceId, redirectToStripeCheckout, processing, hasActiveSubscription }) {
  return (
    <div className="price-card">
      <div className="price-header">
        <div className="title">{title}</div>
      </div>
      <div className="price-body">
        <div>
          <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
          Local News
        </div>
        <div>
          <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
          Business Directory
        </div>
        <div>
          <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
          Local Petitions
        </div>
        <div>
          <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
          Local Exchange Rate
        </div>
        <div>
          <FontAwesomeIcon className="info-icon" icon={faCheckCircle} />
          Local Blogs
        </div>
      </div>
      <div className="price-footer">
        <div className="amount">
          <div className="price">${price}</div>
          <div className="time">/{duration}</div>
        </div>
        <button
          className="price-button"
          disabled={processing}
          onClick={() => redirectToStripeCheckout(priceId)}
        >
          Choose
        </button>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    subscription: state.auth.subscriptionStatus,
  };
}

export default connect(mapStateToProps)(Manage);
