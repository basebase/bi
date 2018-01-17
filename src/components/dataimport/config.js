/**
 * Created by Joker on 18/1/11.
 */

import React from 'react'
import { Button, Input, Select, Card, Table, Row, Col } from 'antd'
import AddSource from './addsource'

import { getDBSourceTable, getDBSourceTable_s } from '../../datas/datasourceColumn'

const Search = Input.Search
const Option = Select.Option



// debugger
const column_s = `${getDBSourceTable_s("http://localhost:8088/api/getSourceConfig")}`
const cols = column_s === "undefined" || column_s === null ? "" : JSON.parse(column_s)



const columns = [{
    title: '数据源名称',
    dataIndex: 'sourceName',
},
    {
    title: '数据源类型',
    dataIndex: 'sourceType',
}, {
    title: '数据源描述',
    dataIndex: 'sourceDescribe',
},];

const data = [{
    key: '1',
    sourceName: 'mysql_测试库',
    sourceType: 'mysql',
    sourceDescribe: '测试数据',
}, {
    key: '2',
    sourceName: 'hive_数据',
    sourceType: 'hive',
    sourceDescribe: '埋点数据',
}, {
    key: '3',
    sourceName: 'log',
    sourceType: 'file',
    sourceDescribe: '系统日志数据',
}, {
    key: '4',
    sourceName: 'mysql_线上',
    sourceType: 'mysql',
    sourceDescribe: '线上数据库',
}];


const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        disabled: record.sourceName === 'mysql_线上', // Column configuration not to be checked
    }),
};

export default class Configuration extends React.Component {
    constructor(props) {
        super(props)
    }

    // componentDidMount() {
    //     let column_s = `${getDBSourceTable_s("http://localhost:8088/api/getSourceConfig")}`
    //     console.log("console_s", column_s)
    // }

    search_data_source = (value) => {
        console.log(value)
    }

    handleChange = (value) => {
        console.log(`selected ${value}`);
    }

    handleBlur = () => {
        console.log('blur');
    }

    handleFocus = () => {
        console.log('focus');
    }


    render() {
        return (
            <div>
                <Card title="搜索域" style={{ "margin-bottom": "10px" }}>
                    <div>
                        <div>
                            <div>
                                <Select
                                    showSearch
                                    style={{ width: 200, "margin-bottom": "20px" }}
                                    placeholder="选择数据源类型"
                                    optionFilterProp="children"
                                    onChange={this.handleChange}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    filterOption={
                                        (input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Option value="mysq">mysq</Option>
                                    <Option value="oracle">oracle</Option>
                                    <Option value="hive">hive</Option>
                                </Select>
                            </div>
                            <div style={{ float: "right" }}>
                                {/*<Button type="primary" onClick={this.addSource}>新增数据源</Button>*/}
                                <AddSource/>
                            </div>
                        </div>

                        <div>
                            <Search
                                style={{ width: 200 }}
                                placeholder="请输入数据源名称"
                                onSearch={this.search_data_source} />
                        </div>
                    </div>
                </Card>

                <Card title="数据源展示域">
                    <Table size="small" rowSelection={rowSelection} columns={columns} dataSource={cols} />
                </Card>
            </div>
        )
    }
}