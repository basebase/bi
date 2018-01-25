/**
 * Created by Joker on 18/1/20.
 */

import React from 'react'
import { Card, Row, Col, Tree, Input, Form, Button, Modal } from 'antd'
const TreeNode = Tree.TreeNode
const FormItem = Form.Item
const { TextArea } = Input
const confirm = Modal.confirm;



class DimensionShow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expand: false,
            value: undefined,
            visible: false,
        }
    }


    onSelect = (selectedKeys, info) => {

        console.log("selectedKeys", selectedKeys)
        console.log("infoffffff", info)

        // confirm({
        //     title: 'Do you Want to delete these items?',
        //     content: 'Some descriptions',
        //     onOk() {
        //         console.log('OK');
        //     },
        //     onCancel() {
        //         console.log('Cancel');
        //     },
        // });
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
        });
    }

    render() {
        return (
            <div>
                <Card style={{ "margin-bottom": "30px" }} title="数据查询">
                    <div>
                        <Row style={{ "margin-bottom": "30px" }}>
                            <Col span={8}>
                                <Tree
                                    showLine
                                    defaultExpandedKeys={['0-0-0']}
                                    onSelect={this.onSelect}
                                >
                                    <TreeNode title="parent 1" key="0-0">
                                        <TreeNode title="parent 1-0" key="0-0-0">
                                            <TreeNode title="leaf" key="0-0-0-0" />
                                            <TreeNode title="leaf" key="0-0-0-1" />
                                            <TreeNode title="leaf" key="0-0-0-2" />
                                        </TreeNode>
                                        <TreeNode title="parent 1-1" key="0-0-1">
                                            <TreeNode title="leaf" key="0-0-1-0" />
                                        </TreeNode>
                                        <TreeNode title="parent 1-2" key="0-0-2">
                                            <TreeNode title="leaf" key="0-0-2-0" />
                                            <TreeNode title="leaf" key="0-0-2-1" />
                                        </TreeNode>
                                    </TreeNode>
                                </Tree>
                            </Col>
                            <Col span={8} offset={8}>
                                <TextArea className="droptarget" id="s" rows={4} />
                            </Col>
                        </Row>
                    </div>

                    <div>
                        <Row>
                            <Col span={8}>
                            </Col>
                            <Col span={8} offset={8}>
                                <TextArea id="t" rows={4} />
                            </Col>
                        </Row>
                    </div>
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