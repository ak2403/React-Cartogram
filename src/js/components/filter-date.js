import React from 'react'
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const FilterDate = props => {
    let { onChange, index } = props


    const dateChange = (date, toString) => {
        let value_return = {
            from: {
                year: date[0].year(),
                month: date[0].month()
            },
            to: {
                year: date[1].year(),
                month: date[1].month()
            }
        }
        onChange(index, value_return)
    }

    return <React.Fragment>
        <span>Date:</span>
        <RangePicker style={{ width: '200px' }} onChange={dateChange} />
    </React.Fragment>
}

export default FilterDate