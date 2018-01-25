/**
 * Created by Joker on 18/1/7.
 */

import React from 'react'
import { Route, Switch } from 'react-router'
import App from '../components/app'
import Welcome from '../components/welcome'
import CsvImport from '../components/dataimport/csv/index'
import DB from '../components/dataimport/db/index'
import Task from '../components/dataimport/task/index'
import DimensionShow from '../components/dataview/dimensionshow/index'
import DataModelCreate from '../components/dataview/datamodelcreate/index'
import ModelDataList from '../components/dataview/modelshow/index'


import Configuration from '../components/dataimport/config'

const routes = (
    <div>
        <Switch>
            <App>
                <Route path="/operating" component={Welcome}/>
                <Route exact path="/dataimport/csv_import" component={ CsvImport }/>
                <Route exact path="/dataimport/database_import" component={ DB }/>
                <Route exact path="/dataimport/config_meta" component={ Configuration }/>
                <Route exact path="/dataimport/task_manage" component={ Task }/>
                <Route exact path="/data_view/muilt_dimension_analysis" component={ DimensionShow }/>
                <Route exact path="/data_view/data_model_create" component={ DataModelCreate }/>
                <Route exact path="/data_view/exist_data_model" component={ ModelDataList }/>
            </App>
        </Switch>
    </div>
)

export default routes