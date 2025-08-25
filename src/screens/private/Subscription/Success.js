import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import Breadcrumbs from "../../misc/Breadcrumbs"
import { Link } from 'react-router-dom'

export default function Success() {
  return (
    <div>
      <Breadcrumbs crumbs={[
        { label: 'Profile', to: '/dashboard/profile' },
        { label: 'Manage Subscription', to: '/dashboard/subscription' },
        { label: 'Subscription Updated' },
      ]} />
      <div className="subscription-updated">
        <div className="success-icon-wrapper">
          <FontAwesomeIcon className="success-icon" icon={faCheckCircle} />
        </div>
        <h2 className="subscription-updated-header">
          Subscription Updated
        </h2>
        <p className="subscription-updated-description">
          You're all set, your subscription has been successfully updated.
          You can <Link to="/dashboard/subscription">review your subscription</Link> or <Link to="/dashboard">visit your dashboard</Link>.
        </p>
      </div>
    </div>
  )
}
