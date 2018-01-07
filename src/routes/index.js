/**
 * Created by Joker on 18/1/7.
 */

import React from 'react'
import { Route, Switch } from 'react-router'
import Welcome from '../components/welcome/index'

const routes = (
    <div>
        <Switch>
            <Route exact path="/" component={ Welcome }/>
        </Switch>
    </div>
)

export default routes