/**
 * Created by Joker on 18/1/25.
 */

import React from 'react'
import { Table, Input } from 'antd'
import { getDBSourceTable_s } from '../../../datas/datasourceColumn'

export default class ModelDataList extends React.Component {
    constructor(props) {
        super(props)
        this.columns = [{
            title: '模型名称',
            dataIndex: 'modelName',
            width: '20%',
            // render: (text, record) => this.renderColumns(text, record, 'name'),
        }, {
            title: '对应数据库',
            dataIndex: 'dbName',
            width: '20%',
            // render: (text, record) => this.renderColumns(text, record, 'age'),
        }, {
            title: '对应数据表',
            dataIndex: 'tabName',
            width: '10%',
            // render: (text, record) => this.renderColumns(text, record, 'address'),
        }, {
            title: '说明',
            dataIndex: 'modelDesc',
            width: '40%',
            // render: (text, record) => this.renderColumns(text, record, 'address'),
        }, {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => {
                const {editable} = record;
                return (
                    <div className="editable-row-operations">
                        <a style={{"margin-right": "8px"}} onClick={() => this.edit(record.key)}>Edit</a>
                    </div>
                );
            },
        }];


        let data = getDBSourceTable_s("http://localhost:8088/api/showDataModelList")
        this.datas = data === undefined || data === null ? null : JSON.parse(data)

    }


    render() {

        const data = [{
            key: "1",
            name: "小墨鱼",
            age: "22",
            address: "xxoo",

        },{
            key: "2",
            name: "大墨鱼",
            age: "25",
            address: "ooxx",

        },{
            key: "3",
            name: "中墨鱼",
            age: "23.5",
            address: "xoxo",

        },]

        return (
            <Table bordered dataSource={this.datas} columns={this.columns} />
        )
    }
}