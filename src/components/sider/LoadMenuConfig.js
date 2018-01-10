import React from 'react'
import ReactDOM from 'react-dom'
import { Menu, Icon, Button } from 'antd'
import { HashRouter as Router, Link, Route } from 'react-router-dom'

const SubMenu = Menu.SubMenu;


// 动态的加载配置文件节点
export const getMenus = (menuArray, parentPath = '/') => {
    return menuArray.map((item) => {


        const linkTo = parentPath + item.key
        if (item.child) {
            return (
                <SubMenu
                    key={linkTo}
                    title={<span>
                        {item.icon ? <Icon type={item.icon} /> : ''}
                        <span>{item.name}</span></span>}>

                    {getMenus(item.child, `${linkTo}/`)}
                </SubMenu>
            );
        }



        return (
            <Menu.Item key={linkTo}>
                <span>{item.icon ? <Icon type={item.icon} /> : ''}</span>
                <span><Link style= {{ color: "#000000" }} to={linkTo}>{item.name}</Link></span>
            </Menu.Item>
        );
    });
}
