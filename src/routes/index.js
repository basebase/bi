/**
 * Created by Joker on 18/1/7.
 */

import React from 'react'
import { Route, Switch } from 'react-router'
import App from '../components/app'
import Welcome from '../components/welcome'
import CsvImport from '../components/dataimport/csv/index'
import DB from '../components/dataimport/db/index'

const routes = (
    <div>
        <Switch>
            <App>
                <Route path="/operating" component={Welcome}/>
                <Route exact path="/dataimport/csv_import" component={ CsvImport }/>
                <Route exact path="/dataimport/database_import" component={ DB }/>
            </App>
        </Switch>
    </div>
)

export default routes