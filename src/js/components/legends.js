import React from 'react'

const Legends = props => {
    let { data, max_radius, min_radius } = props

    let division_range = (max_radius + min_radius) / data.length
    let division_obj = []
    let start_min = 0

    for (let i = 0; i < data.length; i++) {
        division_obj.push({
            min: start_min,
            max: start_min + division_range,
            color: data[i].color
        })
        start_min += division_range
    }

    return <div className="maps-legends">
        {division_obj.map(list => {
            return (<div className="legends">
                <div className="legends-color" style={{ backgroundColor: list.color }}></div> <span>{`${list.min}`} - {`${list.max}`}</span>
            </div>)
        })}
    </div>
}

export default Legends