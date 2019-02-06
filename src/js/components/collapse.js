import React from 'react'
import { Collapse, List } from 'antd'
import _ from 'lodash'

const Panel = Collapse.Panel;

const CollapseComponent = props => {
    let { data } = props
    let dataKeys = Object.keys(data)

    return <Collapse bordered={false} defaultActiveKey={dataKeys}>
        {dataKeys.map(key => {
            let key_data = data[key]
            let list_data = [{
                name: 'Minimum',
                value: key_data.min[key],
                centroid: key_data.min.Centroid
            }, {
                name: 'Maximum',
                value: key_data.max[key],
                centroid: key_data.max.Centroid
            }]
            return <Panel header={key} key={key}>
                <List
                    size="small"
                    bordered
                    dataSource={list_data}
                    renderItem={item => (<List.Item>{item.name} - {item.centroid} <b>({item.value})</b></List.Item>)}
                />
            </Panel>
        })}
    </Collapse>
}

export default CollapseComponent