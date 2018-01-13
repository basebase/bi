/**
 * Created by Joker on 18/1/12.
 */

import axios from 'axios'
import { message } from 'antd'

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



