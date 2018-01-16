/**
 * Created by Joker on 18/1/15.
 */

import React from 'react'
import { Steps, Button, message, Card, Select, Row, Col, Input } from 'antd'
import {withRouter} from 'react-router-dom';
// import routes from '../../routes/index'
import axios from 'axios'

const InputGroup = Input.Group
const Step = Steps.Step
const { TextArea } = Input
const Option = Select.Option




// 步骤1参数
var source = null
var sourceTable = null

// 步骤二参数
var targetSource = null
var targetSourceTable = null
var importBeforeData = null
var importAfterData = null
var overwrite = null

// 步骤三参数
var taskName = null

class ConfigFlow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: 0,
        }
    }

    next = () => {
        const current = this.state.current + 1
        this.setState({
            current: current
        })
    }

    prev = () => {
        const current = this.state.current - 1
        this.setState({
            current: current
        })
    }


    saveDBSyncConfiguration = () => {
        const url = "http://localhost:8088/api/saveDBSyncConfiguration"

        let skv1 = this.refs.s01.input.value + "-" + this.refs.s01_.input.value
        let skv2 = this.refs.s02.input.value + "-" + this.refs.s02_.input.value
        let skv3 = this.refs.s02.input.value + "-" + this.refs.s02_.input.value


        let tkv1 = this.refs.t01.input.value + "-" + this.refs.t01_.input.value
        let tkv2 = this.refs.t02.input.value + "-" + this.refs.t02_.input.value
        let tkv3 = this.refs.t02.input.value + "-" + this.refs.t02_.input.value

        let fieldMapper = [[skv1, tkv1], [skv2, tkv2], [skv3, tkv3]]
        let s = JSON.stringify(fieldMapper)
        console.log("s", s)

        let data = {
            "source": source,
            "sourceTable": sourceTable,
            "targetSource": targetSource,
            "targetSourceTable": targetSourceTable,
            "importBeforeData": importBeforeData,
            "importAfterData": importAfterData,
            "overwrite": overwrite,
            "taskName": taskName,
            "fieldMapper": s
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
            // 如果保存成功了，则跳转页面
            // 不过为了友好起见，我认为可以停留个3秒钟在跳转
            // 如果想要支持this.props.history.push()则需要添加withRouter(ConfigFlow)
            this.props.history.push("/dataimport/csv_import")

        }).catch((error) => {
            message.error("配置保存失败, 请联系相关工作人员")
            console.log(error.response.data.message)
        })
    }

    render() {

        let stepsContent = {
            "margin-top": "16px",
            "border": "1px dashed #e9e9e9",
            "border-radius": "6px",
            "background-color": "#fafafa",
            "min-height": "200px",
            "text-align": "center",
            "padding-top": "80px",
        }

        let stepsAction = {
            "margin-top": "24px",
        }




        const selectSource = () => {

            function handleChange(value) {
                source = value
            }

            function handleChangeTable(value) {
                sourceTable = value
            }

            return <div>
                <div style={{marginBottom: "10px"}}>
                    <Row gutter={8}>
                        <Col span={6}>
                            数据源
                        </Col>
                        <Col span={8}>
                            <Select
                                showSearch
                                style={{width: 400}}
                                placeholder="选择数据源"
                                optionFilterProp="children"
                                key="source"
                                onChange={handleChange}
                                filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value="源1">源1</Option>
                                <Option value="源2">源2</Option>
                                <Option value="源3">源3</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>
                <div>
                    <Row gutter={8}>
                        <Col span={6}>
                            表
                        </Col>
                        <Col span={8}>
                            <Select
                                showSearch
                                style={{width: 400}}
                                name="sourceSelectName"
                                placeholder="选择表"
                                optionFilterProp="children"
                                key="sourceTable"
                                onChange={handleChangeTable}
                                // onFocus={handleFocus}
                                // onBlur={handleBlur}
                                filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value="user">user</Option>
                                <Option value="pay">pay</Option>
                                <Option value="order">order</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>
            </div>
        }

        const selectTargetSource = () => {
            function handleChangeTargetSource(value) {
                targetSource = value
            }

            function handleChangeTargetSourceTable(value) {
                targetSourceTable = value
            }

            function isOverwrite(value) {
                overwrite = value
            }

            function importBeforeEntryHandle(e) {
                let data = document.getElementById('import_before').value
                importBeforeData = data
            }

            function importAfterEntryHandle(e) {
                let data = document.getElementById('import_after').value
                importAfterData = data
            }

            return <div>
                <div style={{marginBottom: "10px"}}>
                    <Row gutter={8}>
                        <Col span={6}>
                            目标源
                        </Col>
                        <Col span={8}>
                            <Select
                                showSearch
                                style={{width: 400}}
                                placeholder="选择数据源"
                                optionFilterProp="children"
                                key="targetSelect"
                                onChange={handleChangeTargetSource}
                                filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value="目标1">目标1</Option>
                                <Option value="目标2">目标2</Option>
                                <Option value="目标3">目标3</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>
                <div style={{marginBottom: "10px"}}>
                    <Row gutter={8}>
                        <Col span={6}>
                            表
                        </Col>
                        <Col span={8}>
                            <Select
                                showSearch
                                style={{width: 400}}
                                placeholder="选择表"
                                optionFilterProp="children"
                                key="targetTable"
                                onChange={handleChangeTargetSourceTable}
                                filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value="user">user</Option>
                                <Option value="pay">pay</Option>
                                <Option value="order">order</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>

                <div style={{marginBottom: "10px"}}>
                    <Row gutter={8}>
                        <Col span={6}>
                            导入前准备语句
                        </Col>
                        <Col span={8}>
                            <TextArea id="import_before" rows={4} onPressEnter={ importBeforeEntryHandle } />
                        </Col>
                    </Row>
                </div>

                <div style={{marginBottom: "10px"}}>
                    <Row gutter={8}>
                        <Col span={6}>
                            导入后准备语句
                        </Col>
                        <Col span={8}>
                            <TextArea id="import_after" rows={4} onPressEnter={ importAfterEntryHandle } />
                        </Col>
                    </Row>
                </div>

                <div>
                    <Row gutter={8}>
                        <Col span={6}>
                            是否覆盖
                        </Col>
                        <Col span={8}>
                            <Select
                                showSearch
                                style={{width: 400}}
                                placeholder="选选择"
                                optionFilterProp="children"
                                onChange={isOverwrite}
                                filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value="1">是</Option>
                                <Option value="2">否</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>
            </div>
        }

        const fieldMapper = () => {
            return <div>
                <Row gutter={8}>
                    <Col span={8}>
                        <InputGroup compact>
                            <Input ref="s01" style={{ width: '20%' }} defaultValue="0571" />
                            <Input ref="s01_" style={{ width: '30%' }} defaultValue="26888888" />
                        </InputGroup>
                        <InputGroup compact>
                            <Input ref="s02" style={{ width: '20%' }} defaultValue="0571" />
                            <Input ref="s02_" style={{ width: '30%' }} defaultValue="26888888" />
                        </InputGroup>
                        <InputGroup compact>
                            <Input ref="s03" style={{ width: '20%' }} defaultValue="0571" />
                            <Input ref="s03_" style={{ width: '30%' }} defaultValue="26888888" />
                        </InputGroup>
                    </Col>
                    <Col span={8}/>
                    <Col span={8}>
                        <InputGroup compact>
                            <Input ref="t01" style={{ width: '20%' }} defaultValue="0571" />
                            <Input ref="t01_" style={{ width: '30%' }} defaultValue="26888888" />
                        </InputGroup>
                        <InputGroup compact>
                            <Input ref="t02" style={{ width: '20%' }} defaultValue="0571" />
                            <Input ref="t02_" style={{ width: '30%' }} defaultValue="26888888" />
                        </InputGroup>
                        <InputGroup compact>
                            <Input ref="t03" style={{ width: '20%' }} defaultValue="0571" />
                            <Input ref="t03_" style={{ width: '30%' }} defaultValue="26888888" />
                        </InputGroup>
                    </Col>
                </Row>
            </div>
        }


        const saveTask = () => {

            function changeInputHandle(value) {
                taskName = document.getElementById('taskName').value
            }

            return <div>
                <Row gutter={8}>
                    <Col span={6}>
                        任务名
                    </Col>
                    <Col span={8}>
                        <Input id="taskName" onBlur={changeInputHandle} />
                    </Col>
                </Row>
            </div>
        }


        const steps = [{
            title: '任务名称',
            content: saveTask()
        },{
            title: '选择来源',
            content: selectSource(),
        },{
            title: '选择目标',
            content: selectTargetSource(),
        }, {
            title: '字段映射',
            content: fieldMapper(),
        },
        //     {
        //     title: '保存任务名',
        //     content: "save",
        // }
        ]


        return (
            <Card title="同步任务配置流程">
                <Steps current={this.state.current}>
                    {steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                <div className="steps-content" style={ stepsContent }>{steps[this.state.current].content}</div>
                <div className="steps-action" style={ stepsAction }>
                    {
                        this.state.current < steps.length - 1
                        &&
                        <Button type="primary" onClick={() => this.next()}>下一步</Button>
                    }
                    {
                        this.state.current === steps.length - 1
                        &&
                        <Button type="primary" onClick={this.saveDBSyncConfiguration}>保存配置</Button>
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
        )
    }
}

export default withRouter(ConfigFlow)