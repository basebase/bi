/**
 * Created by Joker on 18/1/7.
 */

import React from 'react'
import Welcome from '../welcome'
import PropTypes from 'prop-types'

export default class App extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const num = {
            num: 1
        }

        const Sider = ({
            location, // 其实就是一个key
        }) => {
            // 接收的时候没有变量名, 所以包装一下, 是一个k:v值
            const menusProps = {
                location
            }
            console.log("menusProps", {...menusProps})
        }

        console.log("Sider", Sider)


        return(
            // 传递参数到Welcome组件中
            <Welcome {...num} />
        )
    }
}

App.propTypes = {
    location: PropTypes.object,
}


