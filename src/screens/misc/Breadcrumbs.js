import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

function Breadcrumbs({ crumbs }) {
    return (
        <div className="breadcrumbs">
            {crumbs.map((crumb, i) => (
                <Fragment key={i}>
                    {i < crumbs.length - 1 ? (
                        <Fragment>
                            <Link to={crumb.to}>
                                {crumb.label}
                            </Link>
                            <p className="separator">&gt;</p>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <p>
                                {crumb.label}
                            </p>
                        </Fragment>
                    )}
                </Fragment>
            ))}
        </div>
    )
}

export default Breadcrumbs
