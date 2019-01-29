import React from 'react'
import { Select } from 'antd';
import uuid from 'uuid/v4'

const Option = Select.Option;

const FilterSelect = props => {
    let { options, onChange, value } = props

    return <React.Fragment>
        <span>Month:</span>
        <Select
            mode="multiple"
            style={{ width: '200px' }}
            placeholder="Please select"
            value={value || []}
            onChange={onChange}
        >
            {options.map(list => <Option key={uuid()} value={list.value}>{list.text}</Option>)}
        </Select>
    </React.Fragment>
}

export default FilterSelect