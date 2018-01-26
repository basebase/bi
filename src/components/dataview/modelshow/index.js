/**
 * Created by Joker on 18/1/25.
 */

import React from 'react'
import $ from 'jquery'
import { Table, Input, Modal,Divider, message } from 'antd'
import { getDBSourceTable_s, getData } from '../../../datas/datasourceColumn'
import DataModel from './datamodel'
import axios from 'axios'


const confirm = Modal.confirm
var tabs = null

export default class ModelDataList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tab_datas: [],
        }
        this.columns = [{
            title: '模型名称',
            dataIndex: 'modelName',
            width: '20%',
        }, {
            title: '对应数据库',
            dataIndex: 'dbName',
            width: '20%',
        }, {
            title: '对应数据表',
            dataIndex: 'tabName',
            width: '10%',
        }, {
            title: '说明',
            dataIndex: 'modelDesc',
            width: '20%',
        }, {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => {
                const {editable} = record;
                return (
                    <div className="editable-row-operations">
                        <a style={{"margin-right": "8px"}} onClick={() => this.showAndEdit(record.key, false)}>查看</a>
                        <Divider type="vertical"/>
                        <a style={{"margin-right": "8px"}} onClick={() => this.showAndEdit(record.key, true)}>编辑</a>
                        <Divider type="vertical"/>
                        <a style={{"margin-right": "8px"}} onClick={() => this.delDataModel(record.key)}>删除</a>
                    </div>
                );
            },
        }];


        let data = getDBSourceTable_s("http://localhost:8088/api/showDataModelList")
        this.datas = data === undefined || data === null ? null : JSON.parse(data)
    }


    delDataModel = (id) => {

        confirm({
            title: '删除模型?',
            content: '请确认是否删除该模型配置信息',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
                const url = "http://localhost:8088/api/delDataModel"
                let data = {
                    "key": id,
                }
                axios({
                    url: url,
                    method: 'post',
                    data: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then((res) => {
                    message.success(res.data.data)
                }).catch((error) => {
                    message.error(error.response.data.message)
                })
            },
            onCancel() {
            },
        })
    }

    genField = (db_name, tab_name) => {

        const url = "http://localhost:8088/api/showSourceTableField"

        let data = {
            "dataSourceName": db_name,
            "table": tab_name
        }


        $.ajax({
            url: url,
            async:false, //或false,是否异步
            type: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json', // 需要加这一句, 否则会提示Content type 'application/x-www-form-urlencoded;charset=UTF-8' not supported
            cache: false,
            success: function(data) {
                let datas = data.data
                let tab_datas = []
                let count = 1

                for (let dd in datas) {
                    tab_datas.push({
                        key: count,
                        fieldName: dd,
                        fieldType: datas[dd],
                    })

                    ++count
                }

                tabs = tab_datas

                this.setState({
                    tab_datas: tab_datas
                }, ()=>console.log(this.state))

            }.bind(this),
            error: function(xhr, status, err) {
                console.error("getSource Err", err.toString());
            }.bind(this)
        });

    }


    showAndEdit = (key, tag) => {
        const url = "http://localhost:8088/api/showDataModel"
        const data = {
            "key": key
        }


        const resData = `${getData(url, JSON.stringify(data))}`
        const json_data = (resData === "undefined" || resData === null ? "" : JSON.parse(resData))


        if (json_data != null) {
            // 没办法, 需要包装一下, 组件中已经存在相关的名称了...当时没考虑好...
            json_data.dbNamex = json_data.dbName
            json_data.tabNamex = json_data.tabName
            json_data.modelDescx = json_data.modelDesc

            json_data.modelNamex = json_data.modelName
            json_data.transversex = json_data.transverse
            json_data.longitudinalx = json_data.longitudinal
            json_data.tag = tag
            json_data.idx = key



            this.genField(json_data.dbName, json_data.tabName)



            json_data.tabColums = tabs
            console.log("dasdasdsadasdsadjson_data.tabColums", json_data.tabColums)

        }

        Modal.info({
            title: '查看配置信息',
            width: "1200",
            height:"1200",
            content: (
                <div>
                    <DataModel {...json_data} />
                </div>
            ),
            onOk() {},
        });

    }





    render() {
        return (
            <Table bordered dataSource={this.datas} columns={this.columns} />
        )
    }
}