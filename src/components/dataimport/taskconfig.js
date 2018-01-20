/**
 * Created by Joker on 18/1/17.
 */


import React from 'react'
import $ from 'jquery'
import { Steps, Button, message, Card, Select, Row, Col, Input } from 'antd'
import {withRouter} from 'react-router-dom';
// import routes from '../../routes/index'
import axios from 'axios'

const InputGroup = Input.Group
const Step = Steps.Step
const { TextArea } = Input
const Option = Select.Option

var renderCount = 0

var tbs = null
var target_tbs = null
var ops = null

var s_igs = []
var t_igs = []


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


        if (source_inputs != null && target_inputs != null && source_inputs !== undefined && target_inputs !== undefined
        && source_inputs !== "undefined" && target_inputs !== "undefined") {
            inputs_length = source_inputs.length > target_inputs.length ? source_inputs.length : target_inputs.length
        }


        let fms = []

        for(let i = 0; i <inputs_length; i++) {

            let sourceData = ""
            let targetData = ""
            let s_field = ""
            let s_field_type = ""
            let t_field = ""
            let t_field_type = ""
            let s = "-"
            let f = "-"


            if (source_inputs[i] != null) {
                sourceData = source_inputs[i].split("-")
                s_field = sourceData[0]
                s_field_type = sourceData[1]
                s = document.getElementById(s_field).value + "-" + document.getElementById(s_field_type).value
            }

            if (target_inputs[i] != null) {
                targetData = target_inputs[i].split("-")
                t_field = targetData[0]
                t_field_type = targetData[1]
                f = document.getElementById(t_field).value + "-" + document.getElementById(t_field_type).value
            }



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
            "overwrite": overwrite === "否" ? 2 : 1,
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


        const {fieldMapperx, config_id, importAfterDatax, importBeforeDatax,
            overwritex, sourcex, sourceTablex, targetSourcex, targetSourceTablex, taskNamex, tag} = {...this.props}
        configId = config_id


        // 原谅我lowB，点击下一步的时候会重新渲染组件，我就用这种方法绕过去
        //
        source = source !== null ? source : sourcex
        sourceTable = sourceTable !== null ? sourceTable : sourceTablex
        targetSource = targetSource !== null ? targetSource : targetSourcex
        targetSourceTable = targetSourceTable !== null ? targetSourceTable : targetSourceTablex
        importBeforeData = importBeforeData !== null ? importBeforeData : importBeforeDatax
        importAfterData = importAfterData !== null ? importAfterData : importAfterDatax
        overwrite = overwrite !== null ? overwrite : overwritex

        taskName = taskName !== null ? taskName : taskNamex
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

        const selectSource = () => {

            function handleChange(value) {
                source = value
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
                                {genOps()}
                                {ops}
                            </Select>
                        </Col>
                    </Row>
                </div>
            </div>
        }


        const selectSourceTable = () => {

            function handleChangeTable(value) {
                sourceTable = value
            }

            function handleOnSelect(value, option) {
                sourceTable = value
            }

            return <div>
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
                                onSelect={handleOnSelect}
                                filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {genTOps(source, 1)}
                                {tbs}
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
                                {genOps()}
                                {ops}
                            </Select>
                        </Col>
                    </Row>
                </div>
            </div>
        }


        const genTOps = (name, flag) => {
            const url = "http://localhost:8088/api/showSourceTable"
            let params = {
                "dataSourceName": name
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


        const selectTargetSourceTable = () => {
            function handleChangeTargetSourceTable(value) {
                targetSourceTable = value
            }

            function handleOnSelect(value, option) {
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
                                onSelect={handleOnSelect}
                                filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >

                                {genTOps(targetSource, 2)}
                                {target_tbs}
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
                                defaultValue={overwritex}
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

        const genField = (flag) => {

            const url = "http://localhost:8088/api/showSourceTableField"

            let data = {
                "dataSourceName": flag === 1 ? source : targetSource,
                "table": flag === 1 ? sourceTable : targetSourceTable
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
                    s_igs = []
                    t_igs = []

                    if (flag === 1) {
                        source_inputs = []
                    } else {
                        target_inputs = []
                    }

                    let count = 1
                    for (let dd in datas) {

                        let field = flag === 1 ? "s" + count : "t" + count
                        let field_type = flag === 1 ? "s" + count + "_" : "t" + count + "_"


                        let ig = <InputGroup compact>
                            <Input disabled={!tag} id={field} ref={field} style={{ width: '40%' }} defaultValue={dd} />
                            <Input disabled={!tag} id={field_type} ref={field_type} style={{ width: '40%' }} defaultValue={datas[dd]} />
                        </InputGroup>
                        ++count
                        if (flag === 1) {
                            s_igs.push(ig)
                            source_inputs.push(field + "-" + field_type)
                        } else {
                            t_igs.push(ig)
                            target_inputs.push(field + "-" + field_type)
                        }
                    }
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error("getSource Err", err.toString());
                }.bind(this)
            });

        }

        const fieldMapper = () => {
            return <div>
                <Row gutter={8}>
                    <Col span={8}>
                        {genField(1)}
                        {s_igs}
                    </Col>
                    <Col span={8}/>
                    <Col span={8}>
                        {genField(2)}
                        {t_igs}
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
            title: '选择来源表',
            content: selectSourceTable(),
        },{
            title: '选择目标源',
            content: selectTargetSource(),
        },{
            title: '选择目标表',
            content: selectTargetSourceTable(),
        }, {
            title: '字段映射',
            content: fieldMapper(),
        },]


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
