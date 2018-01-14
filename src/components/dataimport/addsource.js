/**
 * Created by Joker on 18/1/12.
 */

import React from 'react'
import propTypes from 'prop-types'
import { Button, Modal, Card, Input, message, Select } from 'antd'
import axios from 'axios'

const Option = Select.Option;


export default class AddSource extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            visible: false,
            option: '',
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    onSelectOptionChange = (value) => {
        this.setState({
            option: value
        })
        console.log("value", value)
    }

    // 获取input标签数据
    setModalInputValues = () => {
        let data_source_name = this.refs.data_source_name.input.value
        let data_source_desc = this.refs.data_source_desc.input.value
        let jdbc_url = this.refs.jdbc_url.input.value
        let db_name = this.refs.db_name.input.value
        let db_password = this.refs.db_password.input.value

        // let inputs = [data_source_name, data_source_desc, jdbc_url, db_name, db_password]

        let inputs = {
            "dataSourceName": data_source_name,
            "dataSourceDesc": data_source_desc,
            "jdbcUrl": jdbc_url,
            "dbName": db_name,
            "dbPassword": db_password,
            "option": this.state.option
        }

        console.log("inputs", inputs)

        return inputs
        // 不能及时响应
        // this.setState({
        //     inputs: [data_source_name, data_source_desc, jdbc_url, db_name, db_password],
        // })

    }

    handleOk = () => {
        // 设置input值
        let inputs = this.setModalInputValues()
        this.setState({ loading: true });
        const url = "http://localhost:8088/api/addSourceConfig"
        axios({
            url: url,
            method: 'post',
            data: JSON.stringify(inputs),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            this.setState({ loading: false, visible: false });
            message.success(res.data.data)
        }).catch((error) => {
            this.setState({ loading: false, visible: false });
            message.error(error.response.data.message)
        })
        // setTimeout(() => {
        //     this.setState({ loading: false, visible: false });
        // }, 3000);
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }


    testConnection = () => {
        let inputs = this.setModalInputValues()
        const url = "http://localhost:8088/api/testConnection"
        axios({
            url: url,
            method: 'post',
            data: JSON.stringify(inputs),
            headers: {
                'Content-Type': 'application/json',
                // 'X-Requested-With': 'XMLHttpRequest',
                // 'Content-Type':'application/x-www-form-urlencoded'
            }
        }).then((res) => {
            this.setState({
                fileList: [],
                uploading: false,
            })
            message.success(res.data.data)
        }).catch((error) => {
            this.setState({
                uploading: false,
            });
            message.error(error.response.data.message)
        })
    }

    render() {
        const { visible, loading } = this.state
        return(
            <div>
                <Button type="primary" onClick={this.showModal}>
                    添加数据源
                </Button>
                <Modal
                    visible={visible}
                    width="900"
                    height="800"
                    title="新增数据源"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            添加数据源
                        </Button>,
                    ]}
                >


                    {/*在Input标签中输入ref的值,这样就可以在外部通过this.refs.ref_name.input.value获取到值了.*/}

                    <div>
                        数据源名称 <Input ref='data_source_name' placeholder="请输入数据源名称" />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        数据源描述 <Input ref='data_source_desc' placeholder="请输入数据源名称" />
                    </div>

                    <div>
                        数据类型
                        <Select onChange={this.onSelectOptionChange} style={{ width: 220 }}>
                            <Option value="mysql">mysql</Option>
                            <Option value="oracle">oracle</Option>
                            <Option value="hive">hive</Option>
                        </Select>
                    </div>

                    <div>
                        JDBC URL <Input ref='jdbc_url' placeholder="请输入数据源名称" />
                    </div>

                    <div>
                        用户名 <Input ref='db_name' placeholder="请输入数据源名称" />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        密码 <Input ref='db_password' placeholder="请输入数据源名称" />
                    </div>

                    <div>
                        测试连通性 <Button onClick={this.testConnection}  type="primary">测试连通性</Button>
                    </div>

                </Modal>
            </div>
        )
    }
}