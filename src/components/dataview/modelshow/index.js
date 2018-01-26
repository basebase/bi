/**
 * Created by Joker on 18/1/25.
 */

import React from 'react'
import { Table, Input, Modal,Divider } from 'antd'
import { getDBSourceTable_s, getData } from '../../../datas/datasourceColumn'
import DataModel from './datamodel'

export default class ModelDataList extends React.Component {
    constructor(props) {
        super(props)
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
                    </div>
                );
            },
        }];


        let data = getDBSourceTable_s("http://localhost:8088/api/showDataModelList")
        this.datas = data === undefined || data === null ? null : JSON.parse(data)
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


            const tabColums = []

            for (let tran of json_data.transverse.split("|")) {
                let nt = tran.split("-")
                tabColums.push({
                    "fieldName": nt[0],
                    "fieldType": nt[1]
                })
            }

            for (let tran of json_data.longitudinal.split("|")) {
                let nt = tran.split("-")
                tabColums.push({
                    "fieldName": nt[0],
                    "fieldType": nt[1]
                })
            }


            json_data.tabColums = tabColums

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