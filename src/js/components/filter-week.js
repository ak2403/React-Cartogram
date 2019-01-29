import React from 'react'
import { DatePicker } from 'antd';

const { WeekPicker } = DatePicker;

const FilterWeek = props => {
    let { onChange } = props

    return <React.Fragment>
        <span>Week:</span>
        <WeekPicker style={{ width: '200px' }} onChange={onChange} placeholder="Select week" />
    </React.Fragment>
}

export default FilterWeek