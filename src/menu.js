/**
 * Created by Joker on 18/1/7.
 */

const menus = [

    {
        key: 'operating',
        name: '运营数据概览',
        icon: 'rocket',
        link: '/operating',
    },
    {
        key: 'product',
        name: '产品数据概览',
        icon: 'notification',
        link: '/product',
    },
    {
        key: 'marketing',
        name: '营销数据概览',
        icon: '/glayout',
    },
    {
        key: 'overview',
        name: '数据导入',
        icon: 'database',
        child: [
            {
                key: 'csv_import',
                name: 'csv导入'
            },

            {
                key: 'execl_import',
                name: 'Execl导入'
            },

            {
                key: 'database_import',
                name: '数据库导入'
            },
            {
                key: 'config_meta',
                name: '配置信息'
            },
            {
                key: 'sql_shell',
                name: 'SQL脚本'
            },
            {
                key: 'task_manage',
                name: '任务管理'
            },
        ]
    },

    {
        key: 'user_action',
        name: '用户行为分析',
        icon: 'line-chart',
        child: [
            {
                key: 'event',
                name: '事件分析'
            },

            {
                key: 'funnel',
                name: '漏斗分析'
            },

            {
                key: 'retained',
                name: '留存分析'
            },

            {
                key: 'distribution',
                name: '分布分析'
            },

            {
                key: 'user_path',
                name: '用户路径'
            },

            {
                key: 'click',
                name: '点击分析'
            }
        ]
    },

    {
        key: 'user',
        name: '关于鱼策',
        icon: 'user',
    },

];

export default menus;