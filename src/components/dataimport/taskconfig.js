/**
 * Created by Joker on 18/1/17.
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

var renderCount = 0

// 源字段input refs数
var source_inputs = []
//目标字段refs数
var target_inputs = []


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

var fm = null

var configId = null



export default class TaskConfig extends React.Component {
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
        const url = "http://localhost:8088/api/editTaskConfiguration"

        let inputs_length = null

        console.log("taskName", taskName)

        if (source_inputs != null && target_inputs != null && source_inputs !== undefined && target_inputs !== undefined
        && source_inputs !== "undefined" && target_inputs !== "undefined") {
            inputs_length = source_inputs.length > target_inputs ? source_inputs.length : target_inputs.length
        }


        let fms = []
        for(let i = 0; i <inputs_length; i++) {
            let sourceData = source_inputs[i].split("-")
            let targetData = target_inputs[i].split("-")

            let s_field = sourceData[0]
            let s_field_type = sourceData[1]

            let t_field = targetData[0]
            let t_field_type = targetData[1]

            let s = document.getElementById(s_field).value + "-" + document.getElementById(s_field_type).value
            let f = document.getElementById(t_field).value + "-" + document.getElementById(t_field_type).value

            let fm = [s, f]
            fms.push(fm)
        }

        let s = JSON.stringify(fms)

        let data = {
            "source": source,
            "sourceTable": sourceTable,
            "targetSource": targetSource,
            "targetSourceTable": targetSourceTable,
            "importBeforeData": importBeforeData,
            "importAfterData": importAfterData,
            "overwrite": overwrite,
            "taskName": taskName,
            "fieldMapper": s,
            "configId": configId,
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
            // this.props.history.push("/dataimport/task_manage")

        }).catch((error) => {
            message.error("配置保存失败, 请联系相关工作人员")
            console.log(error.response.data.message)
        })
    }

    render() {

        console.log("render...!")

        const {fieldMapperx, config_id, importAfterDatax, importBeforeDatax,
            overwritex, sourcex, sourceTablex, targetSourcex, targetSourceTablex, taskNamex, tag} = {...this.props}
        configId = config_id



        source = sourcex
        sourceTable = sourceTablex

        targetSource = targetSourcex
        targetSourceTable = targetSourceTablex
        importBeforeData = importBeforeDatax
        importAfterData = importAfterDatax
        overwrite = overwritex

        taskName = taskNamex
        fm = JSON.stringify(fieldMapperx)




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
                                defaultValue={sourcex}
                                allowClear={!tag}
                                disabled={!tag}
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
                                defaultValue={sourceTablex}
                                allowClear={!tag}
                                disabled={!tag}
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
                                defaultValue={targetSourcex}
                                allowClear={!tag}
                                disabled={!tag}
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
                                defaultValue={targetSourceTablex}
                                allowClear={!tag}
                                disabled={!tag}
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
                            <TextArea disabled={!tag} defaultValue={importBeforeDatax} id="import_before" rows={4} onPressEnter={ importBeforeEntryHandle } />
                        </Col>
                    </Row>
                </div>

                <div style={{marginBottom: "10px"}}>
                    <Row gutter={8}>
                        <Col span={6}>
                            导入后准备语句
                        </Col>
                        <Col span={8}>
                            <TextArea disabled={!tag} defaultValue={importAfterDatax} id="import_after" rows={4} onPressEnter={ importAfterEntryHandle } />
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
                                defaultValue={() => overwritex == 1 ? '是' : '否'}
                                allowClear={!tag}
                                disabled={!tag}
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

        const getSourceField = () => {
            if (fieldMapperx !== null && fieldMapperx !== undefined && fieldMapperx !== "fieldMapperx") {
                const sourceField = []
                source_inputs = []
                let count = 1

                for (let data of fieldMapperx) {
                    var ds = data[0].split('-')

                    let field_ref = "s" + count
                    let field_type_ref = "s" + count + "_"

                    let inputG =
                        <InputGroup compact>
                            <Input id={field_ref} ref={field_ref} disabled={!tag} style={{ width: '20%' }} defaultValue={ds[0]} />
                            <Input id={field_type_ref} ref={field_type_ref} disabled={!tag} style={{ width: '30%' }} defaultValue={ds[1]} />
                        </InputGroup>

                    source_inputs.push(field_ref + "-" + field_type_ref)
                    ++count

                    sourceField.push(inputG)

                }
                return sourceField
            }
        }


        const getTargetField = () => {
            if (fieldMapperx !== null && fieldMapperx !== undefined && fieldMapperx !== "fieldMapperx") {
                const sourceField = []
                target_inputs = []
                let count = 1

                for (let data of fieldMapperx) {
                    var ds = data[1].split('-')

                    let field_ref = "t" + count
                    let field_type_ref = "t" + count + "_"

                    let inputG =
                        <InputGroup compact>
                            <Input id={field_ref} ref={field_ref} disabled={!tag} style={{ width: '20%' }} defaultValue={ds[0]} />
                            <Input id={field_type_ref} ref={field_type_ref} disabled={!tag} style={{ width: '30%' }} defaultValue={ds[1]} />
                        </InputGroup>

                    target_inputs.push(field_ref + "-" + field_type_ref)
                    ++count

                    sourceField.push(inputG)

                }

                return sourceField
            }
        }

        const fieldMapper = () => {
            return <div>
                <Row gutter={8}>
                    <Col span={8}>
                        {getSourceField()}
                    </Col>
                    <Col span={8}/>
                    <Col span={8}>
                        {getTargetField()}
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
                        <Input disabled={!tag} defaultValue={taskNamex} id="taskName" onBlur={changeInputHandle} />
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
                        <Button type="primary" onClick={this.saveDBSyncConfiguration} disabled={!tag} >保存配置</Button>
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
