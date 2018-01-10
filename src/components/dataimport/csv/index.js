/**
 * Created by Joker on 18/1/8.
 */

import React from 'react'
import { Upload, Button, Icon, Card, Row, Col, message } from 'antd';
import FileUpload from '../fileuoload'
const { Meta } = Card;

export default class CsvImport extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div>
                <Card title="从CSV文件导入数据" extra={<a href="#">More</a>}>
                    <FileUpload />
                </Card>
            </div>
        )
    }
}