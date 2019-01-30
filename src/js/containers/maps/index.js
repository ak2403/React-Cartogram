import React, { Component } from "react";
import { Button, Mention } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import $ from 'jquery'
import Papa from 'papaparse'
import Legends from '../../components/legends'
import CreateMap from './functions/render-maps'
import datacsv from '../../data/sample_data.csv';
// import datacsv from '../../data/Rural_Combined_Cohorts_Oct-Dec18.csv';
import { modifyScale } from '../../redux/actions/filter-action'
import { convertMonthtoVal, compulsory_element, non_compulsory_element } from '../../default'

const ButtonGroup = Button.Group;

class RenderMaps extends Component {
    constructor() {
        super();
        this.state = {
            count: 0,
            headers: [],
            max_radius: 0,
            min_radius: 0
        }
        this.updateData = this.updateData.bind(this)
        this.changeScale = this.changeScale.bind(this)
    }

    changeScale(type) {
        let { name, scale } = this.props
        let getScale = scale[name] || 10000

        type === "in" ? getScale += 1000 : getScale -= 1000

        if (getScale > 0) {
            this.props.modifyScale(this.props.name, getScale)
        }
    }

    componentDidMount(){
        let { filter_options, calculations } = this.props
        let { name } = this.props
        let getFilter = filter_options[name] || []

        if (getFilter.length !== 0 || calculations[name]) {
            Papa.parse(datacsv, {
                header: true,
                download: true,
                skipEmptyLines: true,
                complete: (result) => {
                    this.updateData(result)
                }
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let { filter_options, calculations, filter_switch, color_equation_switch } = nextProps
        let { name } = this.props
        let getFilter = filter_options[name] || []

        if (getFilter.length !== 0 || calculations[name]) {
            Papa.parse(datacsv, {
                header: true,
                download: true,
                skipEmptyLines: true,
                complete: (result) => {
                    this.updateData(result)
                }
            });
        }

        if (!this.props.filter_switch.hasOwnProperty(name) || filter_switch[name].switch !== this.props.filter_switch[name].switch) {
            Papa.parse(datacsv, {
                header: true,
                download: true,
                skipEmptyLines: true,
                complete: (result) => {
                    this.updateData(result)
                }
            });
        }

        if (!this.props.color_equation_switch.hasOwnProperty(name) || color_equation_switch[name].switch !== this.props.color_equation_switch[name].switch) {
            Papa.parse(datacsv, {
                header: true,
                download: true,
                skipEmptyLines: true,
                complete: (result) => {
                    this.updateData(result)
                }
            });
        }

        return true
    }

    updateData(result) {
        let { count, headers } = this.state
        let { filter_options, division, name, calculations, color_picker, scale, colors, color_equation_switch, filter_switch } = this.props
        let filters = filter_options[name] || []
        let color_equation = division[name] || []
        let color_array = colors[name] || []

        if(filter_switch[name] && filter_switch[name].switch){
            filters = filter_options[filter_switch[name].target]
        }

        if(color_equation_switch[name] && color_equation_switch[name].switch){
            color_equation = division[color_equation_switch[name].target] || []
            color_array = colors[color_equation_switch[name].target] || []
        }

        let filtered_data = {}

        $(`.${name}`).empty()

        const data = result.data;

        data.map(list => {
            if (list.Centroid !== '(blank)') {
                let is_valid_data = true

                filters.map(filter => {
                    if (filter.value.length !== 0) {
                        if (filter.key === 'Year') {
                            let year_data = Number(list['Year'])
                            if (year_data < filter.value[0] || year_data > filter.value[1]) {
                                is_valid_data = false
                            }
                        } else if (filter.key === 'date') {
                            let get_month_index = convertMonthtoVal(list.Month)
                            // console.log(filter.value)
                            if ((Number(list.Year) >= filter.value.from.year && get_month_index >= filter.value.from.month) &&
                                (Number(list.Year) <= filter.value.to.year && get_month_index <= filter.value.to.month)) {
                                console.log(list)
                            } else {
                                is_valid_data = false
                            }

                        } else if (filter.value.indexOf(list[filter.key]) === -1) {
                            is_valid_data = false
                        }
                    }
                })

                if (is_valid_data) {
                    if (!filtered_data[list.Centroid]) {
                        filtered_data[list.Centroid] = list
                    } else {
                        let get_centroid = filtered_data[list.Centroid]

                        for (let i = 0; i < non_compulsory_element.length; i++) {
                            let current_val = Number(get_centroid[non_compulsory_element[i]])
                            let new_val = Number(list[non_compulsory_element[i]])
                            get_centroid[non_compulsory_element[i]] = current_val + new_val
                        }
                    }
                }
            }
        })

        if (headers.length !== result.meta.fields.length) {
            this.setState({
                headers: result.meta.fields
            })
        }

        if (count !== Object.keys(filtered_data).length) {
            this.setState({
                count: Object.keys(filtered_data).length
            })
        }

        CreateMap(name, filtered_data, color_equation, color_picker, scale[name], calculations[name], color_array)
    }

    render() {
        let { count, max_radius, min_radius, headers } = this.state
        let { division, name } = this.props

        return (
            <div className="maps-display">
                {count !== 0 ? <div className="maps-details">
                    Count: {count}
                    <ButtonGroup size='small'>
                        <Button onClick={() => this.changeScale('in')}>+</Button>
                        <Button onClick={() => this.changeScale('out')}>-</Button>
                    </ButtonGroup>
                </div> : ''}
                <div className={`maps-view ${this.props.name}`}>
                    <div className="smoke-screen">
                        <h3>Make a filter </h3>
                    </div>
                </div>
                <Legends data={division[name] || []} max_radius={max_radius} min_radius={min_radius} />
            </div>
        );
    }
}

const mapStateToProps = props => {
    let { filters } = props

    return {
        filter_options: _.cloneDeep(filters.filter_options),
        color_picker: filters.color_picker,
        division: filters.division,
        scale: filters.scale,
        calculations: filters.calculations,
        colors: filters.colors,
        filter_switch: filters.filter_switch,
        color_equation_switch: filters.color_equation_switch
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    modifyScale
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RenderMaps)