/**
 * Created by Joker on 18/1/20.
 */

import React from 'react'
import { Card, Row, Col, Tree, Input, Form, Button, Modal, Icon, Table, Select } from 'antd'

import {getDBSourceTable_s, getData} from '../../../datas/datasourceColumn'

const TreeNode = Tree.TreeNode
const FormItem = Form.Item
const { TextArea } = Input
const confirm = Modal.confirm



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
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
            model_name_id: null,
        }, () => console.log(this.state));
    }


    selectChangeHandle = (key, option) => {
        let tabName = getData("http://localhost:8088/api/getDataModelTable", JSON.stringify({"key": key}))
        this.setState({
            model_name_id: key,
            table_name: tabName,
        }, () => console.log(this.state))
    }

    treeChangeHandle = (selectedKeys, e) => {

        console.log("dsadasdsadsadasdasd", selectedKeys)

        const { node } = e
        let treeTitle = node.props.title

        let x = this.state.x
        let y = this.state.y

        let type = null


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
                } else {
                    y.splice(y.length, 0, treeTitle)
                }
            }


            this.setState({
                x: x,
                y: y,
                type: type,
                type_val: selectedKeys[0],
            }, ()=>console.log(this.state))

        } else {

            if (this.state.type == 1) {
                x.splice(x.indexOf(this.state.type_val), 1)
            } else {
                y.splice(y.indexOf(this.state.type_val), 1)
            }

            this.setState({
                x: x,
                y: y,
                type: null,
                type_val: null,
            }, ()=>console.log(this.state))
        }


    }


    genTree = () => {
        if (this.state.model_name_id === null) {
            return
        } else {
            console.log("dsathis.state.model_name_id", this.state.model_name_id)
            let data = getData("http://localhost:8088/api/genTree", JSON.stringify({"key": this.state.model_name_id}))
            let tree = data === undefined || data === null ? null : JSON.parse(data)

            // 维度
            const x = []
            let transverse = tree.transverse
            if (transverse !== null) {
                let x_fields = transverse.split("|")
                let x_count = 1
                for (let x_field of x_fields) {
                    let x_fieldName = x_field.split("-")[0]
                    let x_key = "x" + x_count
                    x.push(<TreeNode title={x_fieldName} key={x_key} />)
                }
            }

            // 度量
            const y = []
            let longitudinal = tree.longitudinal
            if (longitudinal !== null) {
                // debugger
                let y_fields = longitudinal.split("|")
                let y_count = 1
                for (let y_field of y_fields) {
                    let y_fieldName = y_field.split("-")[0]
                    let y_key = "y" + y_count
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
        // let data = getDBSourceTable_s("http://localhost:8088/api/getxx")

    }

    render() {
        return (
            <div>
                <Card style={{ "margin-bottom": "30px" }} title="数据查询">
                    <Row gutter={48}>
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
                            <div>
                                <Button type="primary" onClick={this.serach}>查询</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>

                <Card title="数据展示区">
                    Hellox
                </Card>
            </div>
        );
    }
}

const DimensionShowW = Form.create()(DimensionShow)
export default DimensionShowW