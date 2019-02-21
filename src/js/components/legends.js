import React from 'react'
import uuid from 'uuid/v4'

const Legends = props => {
    let { data, max_radius, min_radius } = props

    let division_range = (max_radius + min_radius) / data.length
    let division_obj = []
    let start_min = 0

    let difference = max_radius-min_radius
    for (let i = 0; i < data.length; i++) {
        let from_range = (difference*data[i].from)/100
        let to_range = (difference*data[i].to)/100
        division_obj.push({
            min: min_radius+from_range,
            max: min_radius + to_range,
            color: data[i].color
        })
        start_min += division_range
    }

    return <div className="maps-legends">
        {division_obj.map(list => {
            return (<div key={uuid()} className="legends">
                <div className="legends-color" style={{ backgroundColor: list.color }}></div> <span>{`${Math.round(list.min)}`} - {`${Math.round(list.max)}`}</span>
            </div>)
        })}
    </div>
}

export default Legends