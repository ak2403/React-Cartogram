import React from 'react'
import { Radio } from 'antd';
import uuid from 'uuid/v4'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const FilterRadio = props => {
    let { options, onChange } = props

    return <RadioGroup onChange={onChange} size="small">
        {options.map(list => <RadioButton key={uuid()} value={list.value}>{list.text}</RadioButton>)}
    </RadioGroup>
}

export default FilterRadio