/**
 * Created by Joker on 18/1/8.
 */

import React from 'react'
import { Upload, Button, Icon, message, Col, Row } from 'antd'
import axios from 'axios'

export default class FileUpload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 上传文件数组
            fileList: [],
            uploading: false
        }
    }

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach((file) => {
            // 对前端的一些特性不是很熟悉, 后台一直无法获取到数据, 原来是在append的时候被携程files[]作为key
            // 我在搜索的时候看到antd中name叫做file说是传入到后台去的...!然后基于jq或者传统形式标签中需要加入name
            // 对后台进行传输...后台看到append想了想是不是会存为key:value值,果然...
            // formData.append('files[]', file);
            formData.append('files', file);
        });

        this.setState({
            uploading: true,
        });


        const url = 'http://localhost:8088/api/csv_upload'

        axios({
            url: url,
            method: 'post',
            data: formData,
            headers: {
                // 'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'multipart/form-data',
                // 'Content-Type':'application/x-www-form-urlencoded'
            }
        }).then((res) => {
            this.setState({
                fileList: [],
                uploading: false,
            })
            message.success("上传成功")
        }).catch((error) => {
            this.setState({
                uploading: false,
            });
            message.error("上传失败")
        })
    }

    render() {
        const { uploading } = this.state.uploading
        const props = {
            action: 'http://localhost:8088/api/csv_upload',
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    // 复制数据到新的数组中
                    const newFileList = fileList.slice();
                    // 删除index位置的数据
                    newFileList.splice(index, 1);
                    return {
                        // 返回更新后的文件列表
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    // 以上传的和新上传的封装在一个数组中
                    fileList: [...fileList, file],
                }));

                return false;
            },
            fileList: this.state.fileList,
        }
        return(
            <div>
                <Row gutter={16}>
                    <Col span={8}>
                        <Upload name="files" {...props}>
                            <Button>
                                <Icon type="upload" /> 选择上传文件
                            </Button>
                        </Upload>
                    </Col>
                    <Col span={8}>
                        <Button
                            className="upload-demo-start"
                            type="primary"
                            onClick={this.handleUpload}
                            disabled={this.state.fileList.length === 0}
                            loading={uploading}
                        >
                            {uploading ? '上传中...' : '开始上传' }
                        </Button>
                    </Col>
                </Row>
            </div>
        )
    }
}