/**
 * Created by Joker on 18/1/16.
 */

import React from 'react'
import TaskConfig from '../taskconfig'
import { Table, Divider, Icon, Card, Modal, Button, message } from 'antd'
import { getDBSourceTable_s, getData } from '../../../datas/datasourceColumn'
import axios from 'axios'
import $ from 'jquery'

const data = `${getDBSourceTable_s("http://localhost:8088/api/getTaskConfiguration")}`
const json_data = data === undefined || data === null ? null : JSON.parse(data)
const confirm = Modal.confirm;



var columns = []


export default class Task extends React.Component {


    constructor(props) {
        super(props)
        columns.push({
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
            render: (text, record) => {
                return (
                    <div>
               <span>
                   <Icon type="file-text"/><a onClick={() => this.showTaskConfiguration(record.key)}>查看配置</a>
                   <Divider type="vertical"/>
                   <Icon type="edit"/><a href={`http://localhost:8088/api/editTaskConfiguration/${record.key}`}>修改配置</a>
                   <Divider type="vertical"/>
                   <Icon type="delete"/>
                   <a onClick={() => this.deleteTaskConfiguration(record.key)}>删除配置</a>
                   <Divider type="vertical"/>
                   <Icon type="caret-right"/><a href={`http://localhost:8088/api/runTaskConfiguration/${record.key}`} className="ant-dropdown-link">运行任务</a>
               </span>
                    </div>
                )
            },
        })
    }

    showTaskConfiguration = (key) => {
        const url = "http://localhost:8088/api/showTaskConfiguration"
        const data = {
            "id": key
        }


        const resData = `${getData(url, JSON.stringify(data))}`
        const json_data = (resData === "undefined" || resData === null ? "" : JSON.parse(resData))

        if (json_data != null) {
            let fieldM = $.parseJSON(json_data.fieldMapper)

            // 没办法, 需要包装一下, 组件中已经存在相关的名称了...当时没考虑好...
            json_data.fieldMapperx = fieldM
            json_data.importAfterDatax = json_data.importAfterData
            json_data.importBeforeDatax = json_data.importBeforeData
            json_data.overwritex = json_data.overwrite
            json_data.sourcex = json_data.source
            json_data.sourceTablex = json_data.sourceTable
            json_data.targetSourcex = json_data.targetSource
            json_data.targetSourceTablex = json_data.targetSourceTable
            json_data.taskNamex = json_data.taskName
            json_data.tag = false
        }

        Modal.info({
            title: '任务配置信息查看',
            width: "900",
            height:"800",
            content: (
                <div>
                    <TaskConfig {...json_data} />
                </div>
            ),
            onOk() {},
        });
    }

    deleteTaskConfiguration = (key) => {

        confirm({
            title: '是否删除配置文件',
            content: '该操作无法恢复, 请确认.!',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
                const url = "http://localhost:8088/api/deleteTaskConfiguration"
                const data = {
                    "id": key
                }

                const resData = `${getData(url, JSON.stringify(data))}`
                const json_data = (resData === "undefined" || resData === null ? "" : JSON.parse(resData))
                if (json_data) {
                    message.success("删除配置成功")
                } else {
                    message.error("删除配置失败, 请联系管理员.!")
                }
            },
            onCancel() {
            },
        });


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