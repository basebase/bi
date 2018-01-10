/**
 * Created by Joker on 18/1/9.
 */

import axios from 'axios'

export const post = (url, data) => {
    let axios_post = axios.create({
        baseURL: 'https://localhost:8088/api',
        url: url,
        method: 'post',
        data: data
    })

    axios_post.post(url, data)
        .then((value) => {
        return value
        }).catch((error) => {
        return error
    })
}