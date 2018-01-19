/**
 * Created by Joker on 18/1/18.
 */

import React from 'react'
import $ from 'jquery'
import { Select } from 'antd'

const Option = Select.Option

export var sourceField = null

export const getSource = () => {
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
            let ops = genOptions(data.data)
            console.log("getSource Success", ops)
            sourceField = ops
            return sourceField
        }.bind(this),
        error: function(xhr, status, err) {
            console.error("getSource Err", err.toString());
        }.bind(this)
    });
}


const genOptions = (options) => {
    let ops = []
    for (let op of options) {
        let o = <Option value={op}>{op}</Option>
        ops.push(o)
    }
    return ops
}