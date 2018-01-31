/**
 * Created by Joker on 18/1/20.
 */

import React from 'react'
import { Card, Row, Col, Tree, Input, Form, Button, Modal, Icon, Table, Select, Radio } from 'antd'

import {getDBSourceTable_s, getData} from '../../../datas/datasourceColumn'
import { genBar, genReportData } from '../report/genrep'


import 'echarts/lib/chart/custom'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import echarts from 'echarts'

const TreeNode = Tree.TreeNode
const FormItem = Form.Item
const { TextArea } = Input
const confirm = Modal.confirm
const RadioGroup = Radio.Group


var options = null
var select_val = null

class DimensionShow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            model_name_id: null,
            table_name: null,
            x: null,
            y: null,
            type: null,
            type_val: null,
            radio_value: 1,
            options: [],
            tree_y_radio: 0,
            tree_y_map: null,
            data_show: false,
            data: null
        }


        let data = getDBSourceTable_s("http://localhost:8088/api/showDataModelList")
        this.datas = data === undefined || data === null ? null : JSON.parse(data)
        this.options = []
        for (let d of this.datas) {
            this.options.push(
                <Option value={d.key}>{d.modelName}</Option>
            )
        }

    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
            model_name_id: null,
        }, () => console.log(this.state))
    }


    selectChangeHandle = (key, option) => {
        let tabName = getData("http://localhost:8088/api/getDataModelTable", JSON.stringify({"key": key}))
        this.setState({
            model_name_id: key,
            table_name: tabName,
        }, () => console.log(this.state))
    }

    treeChangeHandle = (selectedKeys, e) => {


        const { node } = e
        let treeTitle = node.props.title

        let x = this.state.x
        let y = this.state.y

        let type = null // x轴或者y轴存在的时候, 然后通过判断类型选择对应的数组进行删除

        let tree_y_map = this.state.tree_y_map === null ? new Map() : this.state.tree_y_map


        const r = []
        r.push(
            <Select defaultValue={0} style={{ width: 120 }} onSelect={this.tree_selectChange}>
                <Option value={0}>请选择</Option>
                <Option value={1}>sum</Option>
                <Option value={2}>count</Option>
                <Option value={3}>max</Option>
                <Option value={4}>min</Option>
            </Select>
        )


        if (selectedKeys !== null && selectedKeys.length > 0) {
            if (selectedKeys[0].indexOf('x') > -1) {
                if (x === null) {
                    x = []
                }

                type = 1
                if (x.indexOf(treeTitle) > -1) {
                    x.splice(x.indexOf(treeTitle), 1)
                } else {
                    x.splice(x.length, 0, treeTitle)
                }
            }

            if (selectedKeys[0].indexOf('y') > -1) {
                if (y === null) {
                    y = []
                }


                type = 0
                if (y.indexOf(treeTitle) > -1) {
                    y.splice(y.indexOf(treeTitle), 1)
                    //
                    tree_y_map.delete(treeTitle)
                    //

                } else {

                    y.splice(y.length, 0, treeTitle)

                    confirm({
                        title: '选取需要的聚合方法?',
                        content: r,
                        onOk: () => {
                            tree_y_map.set(treeTitle, this.state.tree_y_radio)
                        },
                        onCancel() {

                        },
                    })

                }
            }


            this.setState({
                x: x,
                y: y,
                type: type,
                type_val: selectedKeys[0],
                tree_y_map: tree_y_map,
            }, ()=>console.log(this.state))

        } else {

            if (this.state.type == 1) {
                x.splice(x.indexOf(this.state.type_val), 1)
            } else {
                y.splice(y.indexOf(this.state.type_val), 1)
                tree_y_map.delete(treeTitle)
            }

            this.setState({
                x: x,
                y: y,
                type: null,
                type_val: null,
                tree_y_map: tree_y_map
            }, ()=>console.log(this.state))
        }


    }

    tree_selectChange = (value, option) => {
        select_val = value === 0 ? 1 : value
        this.setState({
            tree_y_radio: value
        }, ()=>console.log(this.state));
    }


    genTree = () => {
        if (this.state.model_name_id === null) {
            return
        } else {

            let data = getData("http://localhost:8088/api/genTree", JSON.stringify({"key": this.state.model_name_id}))
            let tree = data === undefined || data === null ? null : JSON.parse(data)

            // 维度
            const x = []
            options = new Map()
            let transverse = tree.transverse
            if (transverse !== null) {
                let x_fields = transverse.split("|")
                let x_count = 1
                for (let x_field of x_fields) {
                    let x_fieldName = x_field.split("-")[0]
                    let x_key = "x" + x_count
                    ++x_count
                    x.push(<TreeNode title={x_fieldName} key={x_key} />)
                    options.set(x_fieldName, x_field.split("-")[1])
                }
            }

            // 度量
            const y = []
            let longitudinal = tree.longitudinal
            if (longitudinal !== null) {
                let y_fields = longitudinal.split("|")
                let y_count = 1
                for (let y_field of y_fields) {
                    let y_fieldName = y_field.split("-")[0]
                    let y_key = "y" + y_count
                    ++y_count
                    y.push(<TreeNode title={y_fieldName} key={y_key} />)
                }
            }


            return (
                <Tree
                    showLine
                    defaultExpandedKeys={['x0']}
                    onSelect={this.treeChangeHandle}
                >
                    <TreeNode title="parent 1" key="0-0">
                        <TreeNode title="维度" key="x0">
                            {x}
                        </TreeNode>
                        <TreeNode title="度量" key="y0">
                            {y}
                        </TreeNode>
                    </TreeNode>
                </Tree>
            )
        }
    }


    genTextArea = () => {
        if (this.state.model_name_id === null) {
            return
        } else {
            return (
                <div>
                    <div style={{ "margin-bottom": "10px" }}>
                        <TextArea value={this.state.x} placeholder="维度数据在这里展示" rows={4} />
                    </div>
                    <div>
                        <TextArea value={this.state.y} placeholder="度量数据在这里展示" rows={4} />
                    </div>
                </div>
            )
        }
    }

    serach = () => {


        let xStr_S = "{"
        let xStr_C = ""
        let xStr_E = "}"

        if (this.state.x !== null) {
            for (let option of this.state.x) {
                let v = document.getElementById(option).value
                console.log("dsadadasdasdasdsadsadsadasx", v)
                if (v === null || v === "" || v === undefined ) {
                    v = "\"notwhere\""
                    xStr_C += option + ":" + v + ","
                } else {
                    xStr_C += option + ":" + "\"" + v + "\"" + ","
                }
            }
        }

        let x = xStr_S + xStr_C.substring(0, xStr_C.length - 1) + xStr_E


        // 聚合选项参数
        let tree_y_map = this.state.tree_y_map

        let yStr_S = "{"
        let yStr_C = ""
        let yStr_E = "}"


        tree_y_map.forEach((v, k) => {
            yStr_C += k + ":" + v + ","
        })

        let y = yStr_S + yStr_C.substring(0, yStr_C.length - 1) + yStr_E


        console.log("xstr", x)
        console.log("ystr", y)



        let params = {
            "tableName": this.state.table_name,
            "transverse": x,
            "longitudinal": y,
        }

        console.log(params)

        let data = getData("http://localhost:8088/api/getReportData", JSON.stringify(params))
        console.log("datassssss", data)

        this.setState({data_show: tree_y_map, data: data}, ()=>console.log(this.state))
    }

    radioChange = (e) => {
        this.setState({
            radio_value: e.target.value,
        }, ()=>console.log(this.state));
    }

    genGraphics = () => {
        if (this.state.data_show === false) {
            return
        } else {

            const radioStyle = {
                display: 'block',
                height: '30px',
                lineHeight: '30px',
            };

            return (


                <Card title="数据展示区">
                    <Row gutter={48}>
                        <Col span={4}>
                            <RadioGroup onChange={this.radioChange} value={this.state.radio_value}>
                                <Radio style={radioStyle} value={1}>表格</Radio>
                                <Radio style={radioStyle} value={2}>柱状图</Radio>
                                <Radio style={radioStyle} value={3}>饼图</Radio>
                                <Radio style={radioStyle} value={4}>折线图</Radio>
                            </RadioGroup>
                        </Col>

                        <Col span={8}>
                            <div id="report" style={{width: "300%", height: "300%"}}>
                                {this.gen_graphics(this.state.radio_value)}
                            </div>

                        </Col>
                        <Col span={4} />
                        <Col span={4} />
                        <Col span={4} />
                    </Row>
                </Card>
            )
        }
    }


    gen_graphics = (radio_value) => {
        let context = document.getElementById('report')

        if (context !== null && context !== undefined) {
            if (radio_value === 1) {

                const columns = []

                let keys = new Array()

                if (this.state.x !== null) {
                    for (let x_data of this.state.x) {
                        let col = {
                            title: x_data,
                            dataIndex: x_data,
                            key: x_data,
                        }
                        columns.push(col)
                    }
                }

                if (this.state.tree_y_map !== null) {
                    this.state.tree_y_map.forEach((v, k) => {
                        if (v !== 0) {
                            let newK = ""
                            if (v === 1) {
                                newK += "sum(" + k + ")"
                            } else if (v === 2) {
                                newK += "count(" + k + ")"
                            } else if (v === 3) {
                                newK += "max(" + k + ")"
                            } else if (v === 4) {
                                newK += "min(" + k + ")"
                            }

                            let col = {
                                title: newK,
                                dataIndex: newK,
                                key: newK,
                            }

                            columns.push(col)
                        }
                    })
                }

                console.log(JSON.parse(this.state.data))

                return (
                    <Table columns={columns} dataSource={JSON.parse(this.state.data)} />
                )

            } else if (radio_value === 2) {

            } else if (radio_value === 3) {

            } else if (radio_value === 4) {

            }
        }
    }


    /***
     * 动态生成x轴的参数输入框
     * @returns {Array}
     */
    genOptions = () => {
        const op = []
        if (this.state.x === null) {
            return
        } else {

            for (let option of this.state.x) {
                let type = options.get(option)
                if (type.toLowerCase() === "varchar" || type.toLowerCase() === "int" || type.toLowerCase() === "int unsigned" || type.toLowerCase() === "boolean") {
                    op.push(
                        <Col span={8}>
                            <input key={option} id={option} placeholder={`${option}` + "参数输入"} />
                        </Col>
                    )
                }
            }

            return op
        }
    }

    render() {
        return (
            <div>
                <Card style={{ "margin-bottom": "30px" }} title="数据查询">
                    <Row style={{ "margin-bottom": "10px" }} gutter={48}>
                        <Col span={8}>
                            <Button type="primary" onClick={this.showModal}><Icon type="loading-3-quarters" />切换数据</Button>
                            <Modal
                                title="数据模型"
                                width="800"
                                height="800"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                            >

                                <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="Select a person"
                                    optionFilterProp="children"
                                    onSelect={this.selectChangeHandle}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {this.options}
                                </Select>

                            </Modal>
                        </Col>
                        <Col span={8}>
                            {this.genTree()}
                        </Col>
                        <Col span={8}>
                            <div style={{ "margin-bottom": "10px" }}>
                                {this.genTextArea()}
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        {this.genOptions()}
                        <div style={{ "float": "right" }}>
                            <Button type="primary" onClick={this.serach}>查询</Button>
                        </div>
                    </Row>
                </Card>


                {this.genGraphics()}
            </div>
        );
    }
}

const DimensionShowW = Form.create()(DimensionShow)
export default DimensionShowW