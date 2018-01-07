/**
 * Created by Joker on 18/1/7.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'connected-react-router'
import routes from './routes'

const R = ({ history }) => {
    return (
        <ConnectedRouter history={ history }>
            { routes }
        </ConnectedRouter>
    )
}

R.propTypes = {
    history: PropTypes.object,
}

export default R