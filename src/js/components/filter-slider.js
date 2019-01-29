import React from 'react'
import { Slider } from 'antd';

const FilterWeek = props => {
    let { onChange, value } = props

    return <React.Fragment>
        <span>Year:</span>
        <Slider style={{ width: '200px' }}
        onChange={onChange} range step={1} min={2010} max={2020} value={value || [2017, 2018]} />
    </React.Fragment>
}

export default FilterWeek