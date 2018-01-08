/**
 * Created by Joker on 18/1/7.
 */

import React from 'react'


export default class Welcome extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        // 当App组件使用时候可以<Welcome ...props>
        // 然后Welcome可以通过获取传递过来的参数 {...this.props}
        const {num} = {...this.props}
        return (
            <div>
                <ul>
                    <li>num={num}</li>
                </ul>
            </div>
        )
    }
}