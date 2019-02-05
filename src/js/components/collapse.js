import React from 'react'
import { Collapse, List } from 'antd'
import _ from 'lodash'

const Panel = Collapse.Panel;

const text = (
    <p style={{ paddingLeft: 24 }}>
        A dog is a type of domesticated animal.
        Known for its loyalty and faithfulness,
        it can be found as a welcome guest in many households across the world.
  </p>
);

const CollapseComponent = props => {
    let { data } = props
    let dataKeys = Object.keys(data)

    return <Collapse bordered={false} defaultActiveKey={dataKeys}>
        {dataKeys.map(key => {
            let key_data = data[key]
            return <Panel header={key} key={key}>
                <h6 style={{ marginBottom: 16 }}>Minimum</h6>
                <List
                    size="small"
                    header={<div>Minimum</div>}
                    bordered
                    dataSource={Object.keys(key_data.min)}
                    renderItem={item => (<List.Item>{item} - {key_data.min[item]}</List.Item>)}
                    />
            </Panel>
        })}
    </Collapse>
}

export default CollapseComponent