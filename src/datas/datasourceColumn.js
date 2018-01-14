/**
 * Created by Joker on 18/1/12.
 */

import axios from 'axios'
import $ from 'jquery'
import { message } from 'antd'


export const getDBSourceTable_s = (url) => {
    let result = undefined
    $.ajax({
        url: url,
        async:false, //或false,是否异步
        type: 'POST',
        dataType: 'json',
        cache: false,
        success: function(data) {
            console.log("data", data.data)
            result = JSON.stringify(data.data)
        }.bind(this),
        error: function(xhr, status, err) {
            console.error("err", err.toString());
        }.bind(this)
    });
    return result
}


// 从服务器端请求数据

export const getDBSourceTable = (url) => {
    var data = [{}]
    axios({
        url: url,
        method: 'post',
        data: null,
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((res) => {
        // debugger
        // message.success(res.data.data)
        data = res.data.data
        console.log("data => ", data)
    }).catch((error) => {
        message.error(error.response.data.message)
    })

    return data
}




