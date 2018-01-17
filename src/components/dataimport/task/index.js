/**
 * Created by Joker on 18/1/16.
 */

import React from 'react'
import { Table, Divider, Icon, Card } from 'antd'
import { getDBSourceTable_s } from '../../../datas/datasourceColumn'

const data = `${getDBSourceTable_s("http://localhost:8088/api/getTaskConfiguration")}`
const json_data = data === undefined || data === null ? null : JSON.parse(data)

console.log("task_data", json_data)

const columns = [{
    title: '任务名称',
    dataIndex: 'taskName',
}, {
    title: '创建人',
    dataIndex: 'taskCreateUser',
},{
    title: '创建时间',
    dataIndex: 'taskCreateTime'
},{
    title: '操作',
    key: 'action',
    render: (text, record) => (
        <span>
            <Icon type="file-text" /><a href={`http://localhost:8088/api/showTaskConfiguration/${record.key}`}>查看配置</a>
            <Divider type="vertical" />
            <Icon type="edit" /><a href={`http://localhost:8088/api/editTaskConfiguration/${record.key}`}>修改配置</a>
            <Divider type="vertical" />
            <Icon type="delete" /><a href={`http://localhost:8088/api/deleteTaskConfiguration/${record.key}`}>删除配置</a>
            <Divider type="vertical" />
            <Icon type="caret-right"/><a href={`http://localhost:8088/api/runTaskConfiguration/${record.key}`} className="ant-dropdown-link">运行任务</a>
        </span>
    ),
}];


export default class Task extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div>
                <Card title="任务列表">
                    <Table columns={columns} dataSource={json_data} />
                </Card>
            </div>
        )
    }
}