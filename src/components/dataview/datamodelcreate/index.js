/**
 * Created by Joker on 18/1/24.
 */

import React from 'react'
import $ from 'jquery'
import axios from 'axios'
import { Steps, Button, message, Card, Row, Col, Select, Input, Table, Tree, Modal, Divider, Radio } from 'antd'
const Step = Steps.Step
const Option = Select.Option
const TextArea = Input.TextArea
const TreeNode = Tree.TreeNode
const confirm = Modal.confirm
const RadioGroup = Radio.Group


/* create_model_info 开始 */
var db_name = null
var tab_name = null
var ops = null
var tbs = null
var target_tbs = null
var tab_name = null
const columns = []


const dimension = []

export default class DataModelCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            db_name: "",
            tab_name: "",
            model_name: "",
            model_desc: "",
            tab_datas: [],
            transverse: [], //维度
            longitudinal: [], // 度量
        }


        columns.push({
            title: '字段名',
            dataIndex: 'fieldName',
        }, {
            title: '字段类型',
            dataIndex: 'fieldType',
        },{
            title: '操作',
            key: 'action',
            render: (text, record) => {
                return (
                    <div>
               <span>
                   <a onClick={() => this.showConfirm(record.fieldName, 1)}>添加到维度</a>
                   <Divider type="vertical"/>
                   <a onClick={() => this.showConfirm(record.fieldName, 2)}>添加到度量</a>
               </span>
                    </div>
                )
            },
        })
    }





    showConfirm = (id, flag) => {
        console.log("id----", id)
        let transverse = this.state.transverse
        let longitudinal = this.state.longitudinal

        if (flag === 1) {
            if (transverse.indexOf(id) === -1 || transverse.length === 0) {

                if (longitudinal.indexOf(id) != -1) {
                    longitudinal.splice(longitudinal.indexOf(id), 1)
                    this.setState({
                        longitudinal: longitudinal
                    }, () => console.log(this.state))
                }

                transverse.splice(transverse.length, 0, id)
                this.setState({
                    transverse: transverse
                }, () => console.log(this.state))
            }
        } else {
            if (longitudinal.indexOf(id) === -1 || longitudinal.length === 0) {
                if (transverse.indexOf(id) != -1) {
                    transverse.splice(transverse.indexOf(id), 1)
                    this.setState({
                        transverse: transverse
                    }, () => console.log(this.state))
                }

                longitudinal.splice(longitudinal.length, 0, id)
                this.setState({
                    longitudinal: longitudinal
                }, () => console.log(this.state))
            }
        }



        confirm({
            title: flag === 1 ? '是否将字段添加到维度?' : '是否将字段添加到度量?',
            onOk() {

            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }


    next() {
        const current = this.state.current + 1
        this.setState({ current })
    }
    prev() {
        const current = this.state.current - 1
        this.setState({ current })
    }

    save_data_model = () => {
        const url = "http://localhost:8088/api/saveDataModel"

        let data = {
            "dbName": this.state.db_name,
            "tabName": this.state.tab_name,
            "modelDesc": this.state.model_desc,
            "modelName": this.state.model_name,
            "transverse": this.state.transverse.join("|"),
            "longitudinal": this.state.longitudinal.join("|"),
        }

        axios({
            url: url,
            method: 'post',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            console.log("res", res.data.data)
            message.success(res.data.data)
        }).catch((error) => {
            message.error("配置保存失败, 请联系相关工作人员")
            console.log(error.response.data.message)
        })
    }

    render() {

        let style_content = {
            "margin-top": "16px",
            "border": "1px dashed #e9e9e9",
            "border-radius": "6px",
            "background-color": "#fafafa",
            "min-height": "200px",
            "text-align": "center",
            "padding-top": "80px",
        }

        let style_action = {
            "margin-top": "24px"
        }





        const genOps = () => {
            const url = "http://localhost:8088/api/showSource"
            $.ajax({
                url: url,
                async:false, //或false,是否异步
                type: 'POST',
                data: null,
                dataType: 'json',
                contentType: 'application/json', // 需要加这一句, 否则会提示Content type 'application/x-www-form-urlencoded;charset=UTF-8' not supported
                cache: false,
                success: function(data) {
                    let datas = data.data
                    ops = []
                    for (let op of datas) {
                        let o = <Option value={op}>{op}</Option>
                        ops.push(o)
                    }
                    return ops
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error("getSource Err", err.toString());
                }.bind(this)
            });
        }


        const genTOps = (flag) => {

            console.log("db_name", this.state.db_name)

            const url = "http://localhost:8088/api/showSourceTable"
            let params = {
                "dataSourceName": this.state.db_name
            }

            $.ajax({
                url: url,
                async:false, //或false,是否异步
                type: 'POST',
                data: JSON.stringify(params),
                dataType: 'json',
                contentType: 'application/json', // 需要加这一句, 否则会提示Content type 'application/x-www-form-urlencoded;charset=UTF-8' not supported
                cache: false,
                success: function(data) {
                    // debugger
                    let datas = data.data
                    tbs = []
                    target_tbs = []
                    for (let op of datas) {
                        let o = <Option value={op}>{op}</Option>
                        flag === 1 ? tbs.push(o) : target_tbs.push(o)
                    }
                    return tbs
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error("getSource Err", err.toString());
                }.bind(this)
            });

        }

        const create_model_info = () => {
            return <div>
                <div style={{marginBottom: "10px"}}>
                    <Row gutter={8}>
                        <Col span={6}>
                            模型名称
                        </Col>
                        <Col span={8}>
                            <Input onBlur={getModelName} id="model_name" rows={4} />
                        </Col>
                    </Row>
                </div>
                <div style={{marginBottom: "10px"}}>
                    <Row gutter={8}>
                        <Col span={6}>
                            数据源
                        </Col>
                        <Col span={8}>
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Select a person"
                                optionFilterProp="children"
                                onChange={db_source_change_handle}
                                onSelect={db_source_select_handle}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {genOps()}
                                {ops}
                            </Select>
                        </Col>
                    </Row>
                </div>
                <div style={{marginBottom: "10px"}}>
                    <Row gutter={8}>
                        <Col span={6}>
                            所属表
                        </Col>
                        <Col span={8}>
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Select a person"
                                optionFilterProp="children"
                                onChange={tab_source_change_handle}
                                onSelect={tab_source_select_handle}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {genTOps(1)}
                                {tbs}
                            </Select>
                        </Col>
                    </Row>
                </div>
                <div>
                    <Row gutter={8}>
                        <Col span={6}>
                            备注
                        </Col>
                        <Col span={8}>
                            <TextArea id="get_model_describe" rows={2} onPressEnter={ get_model_describe } />
                        </Col>
                    </Row>
                </div>
            </div>
        }





        const getModelName = () => {
            let model_name = document.getElementById("model_name").value
            console.log("model_name", model_name)
            this.setState({
                model_name: model_name
            }, ()=>console.log(this.state))
        }

        const db_source_change_handle = (value) => {
            console.log("db_source_change_handle", value)
            db_name = value
            this.setState({db_name: value}, ()=>console.log(this.state))
        }

        const db_source_select_handle = (value, option) => {
            console.log("db_source_select_handle", value)
            db_name = value
            this.setState({db_name: value}, ()=>console.log(this.state))
        }


        const tab_source_change_handle = (value) => {
            console.log("db_source_change_handle", value)
            tab_name = value
            this.setState({
                tab_name: value
            }, ()=>console.log(this.state))

            genField(tab_name)
        }

        const tab_source_select_handle = (value, option) => {
            console.log("db_source_select_handle", value)
            tab_name = value
            this.setState({
                tab_name: value
            }, ()=>console.log(this.state))
            genField(tab_name)
        }

        const get_model_describe = () => {
            let model_desc = document.getElementById("get_model_describe").value
            this.setState({
                model_desc: model_desc
            }, ()=>console.log(this.state))
        }





        const genField = (tab_name) => {

            const url = "http://localhost:8088/api/showSourceTableField"

            let data = {
                "dataSourceName": this.state.db_name,
                "table": this.state.tab_name === null || this.state.tab_name === "" || this.state.tab_name === undefined ? tab_name : this.state.tab_name
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


                    this.setState({
                        tab_datas: tab_datas
                    }, ()=>console.log(this.state))

                }.bind(this),
                error: function(xhr, status, err) {
                    console.error("getSource Err", err.toString());
                }.bind(this)
            });

        }





        const getTableField = () => {

            return <div>
                <Row gutter={48}>
                    <Col span={12}>
                        <Table pagination={false} columns={columns} dataSource={this.state.tab_datas} size="small" />
                    </Col>
                    <Col style={{ "margin-bottom": "10px" }} span={8}>
                        <TextArea value={this.state.transverse} placeholder="维度数据在这里展示" rows={4} />
                    </Col>
                    <Col span={8}>
                        <TextArea value={this.state.longitudinal} placeholder="度量数据在这里展示" rows={4} />
                    </Col>
                </Row>
            </div>
        }



        const steps = [{
            title: '创建数据模型名称',
            content: create_model_info(),
        },{
            title: '模型字段展示',
            content: getTableField()
        },
// }, {
//     title: 'Last',
//     content: set(),
// }
        ]





        const { current } = this.state;
        return (
            <div>
                <Card title="创建新的数据模型">
                    <Steps current={current}>
                        {steps.map(item => <Step key={item.title} title={item.title} />)}
                    </Steps>
                    <div style={style_content}>{steps[this.state.current].content}</div>
                    <div style={style_action}>
                        {
                            this.state.current < steps.length - 1
                            &&
                            <Button type="primary" onClick={() => this.next()}>下一步</Button>
                        }
                        {
                            this.state.current === steps.length - 1
                            &&
                            <Button type="primary" onClick={this.save_data_model}>保存配置</Button>
                        }
                        {
                            this.state.current > 0
                            &&
                            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                上一步
                            </Button>
                        }
                    </div>
                </Card>
            </div>
        );
    }
}
