/**
 * Created by Joker on 18/1/7.
 */

import React from 'react'
import { Route, Switch } from 'react-router'
import App from '../components/app'
import Welcome from '../components/welcome'
import Home from '../components/home'
import Product from '../components/product'


const routes = (
    <div>
        <Switch>
            <Route exact path="/" component={ Welcome }/>
            <App>
                <Route path="/operating" component={Home}/>
                <Route path="/product" component={Product}/>
            </App>
        </Switch>
    </div>
)

export default routes