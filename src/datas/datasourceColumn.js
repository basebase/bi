/**
 * Created by Joker on 18/1/12.
 */

import axios from 'axios'

// 从服务器端请求数据

export const getDBSourceTable = (url) => {
    axios({
        url: url,
        method: 'post',
        data: JSON.stringify(inputs),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        message.success(res.data.data)
    }).catch((error) => {
        message.error(error.response.data.message)
    })
}
