/**
 * Created by Joker on 18/1/11.
 */

import React from 'react'
import { Card, Row, Col, Table } from 'antd'
import ConfigFlow from '../configflow'

const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="#">{text}</a>,
}, {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
}]

const data = [{
    key: '1',
    name: 'source_01',
    type: 'varchar',
}, {
    key: '2',
    name: 'source_02',
    type: 'bigint',
}, {
    key: '3',
    name: 'source_03',
    type: 'boolean',
}];

export default class DB extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <ConfigFlow />
        )
    }
}

{/*<div>*/}
{/*<Card title="数据关系映射" extra={<a href="#">More</a>}>*/}
{/*<Row gutter={16}>*/}
{/*<Col span={8}>*/}
{/*<Table  pagination={false} columns={columns}  dataSource={data} />*/}
{/*</Col>*/}
{/*<Col span={8} />*/}
{/*<Col span={8}>*/}
{/*<Table  pagination={false} columns={columns}  dataSource={data} />*/}
{/*</Col>*/}
{/*</Row>*/}
{/*</Card>*/}
{/*</div>*/}