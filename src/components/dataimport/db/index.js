/**
 * Created by Joker on 18/1/11.
 */

import React from 'react'
import { Card, Row, Col } from 'antd'

export default class DB extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div>
                <Card title="数据关系映射" extra={<a href="#">More</a>}>
                    <Row gutter={16}>
                        <Col span={10}>
                            <p>source_01 varchar</p>
                            <p>source_02 int</p>
                            <p>source_03 boolean</p>
                        </Col>
                        <Col span={12}>
                            <p>target_01 varchar</p>
                            <p>target_02 int</p>
                            <p>target_03 boolean</p>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}