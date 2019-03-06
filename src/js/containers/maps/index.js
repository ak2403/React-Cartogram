import React, { Component } from "react";
import { Button, Drawer, Radio } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from 'lodash'
import $ from 'jquery'
import Papa from 'papaparse'
import Legends from '../../components/legends'
import CollapseComponent from '../../components/collapse'
import CreateMap from './functions/render-maps'
import Datasets from '../../../data'
import { modifyScale, updateStatistics, resetSettings } from '../../redux/actions/filter-action'
import { statistics_array, convertMonthtoVal, compulsory_element, non_compulsory_element } from '../../../default'

const ButtonGroup = Button.Group;

class RenderMaps extends Component {
    constructor() {
        super();
        this.state = {
            count: 0,
            headers: [],
            max_radius: 0,
            min_radius: 0,
            visible: false,
            placement: 'left',
            statistics: {},
            reload: false
        }
        this.updateData = this.updateData.bind(this)
        this.changeScale = this.changeScale.bind(this)
        this.showDrawer = this.showDrawer.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    showDrawer() {
        this.setState({
            visible: true,
        });
    };

    onClose() {
        this.setState({
            visible: false,
        });
    };

    onChange(e) {
        this.setState({
            placement: e.target.value,
        });
    }

    changeScale(type) {
        let { name, scale } = this.props
        let getScale = scale[name] || 0

        type === "in" ? getScale += 1000 : getScale -= 1000

        // if (getScale > 0) {
            this.props.modifyScale(this.props.name, getScale)
        // }
    }

    // componentDidMount(){
    //     let { filter_options, calculations } = this.props
    //     let { name } = this.props
    //     let getFilter = filter_options[name] || []

    //     if (getFilter.length !== 0 || calculations[name]) {
    //         Papa.parse(datacsv, {
    //             header: true,
    //             download: true,
    //             skipEmptyLines: true,
    //             complete: (result) => {
    //                 this.updateData(result)
    //             }
    //         });
    //     }
    // }

    shouldComponentUpdate(nextProps, nextState) {
        let { reload } = nextProps
        let { name, dataset } = this.props

        if (this.state.reload !== nextState.reload) {
            this.setState({
                reload: false
            })
            return true
        }

        if (reload[name]) {
            Papa.parse(Datasets[dataset], {
                header: true,
                download: true,
                skipEmptyLines: true,
                complete: (result) => {
                    this.updateData(result)
                }
            });
            this.props.resetSettings(name)
        }

        return true
    }

    updateData(result) {
        let { count } = this.state
        let { centroid_name, common_color_props, common_size_props, column_filters, filter_options, division, name, calculations, color_picker, scale, colors, color_equation_switch, filter_switch, size_switch, centroid_filters, bubble_size, statistics } = this.props
        let filters = filter_options[name] || []
        let color_equation = division[name] || []
        let color_array = colors[name] || []
        let size_equation = calculations[name]
        let filter_centroid = centroid_filters[name] || []
        let filter_column = column_filters[name] || {}
        let coordinates = {
            topLat: 0,
            topLong: 0,
            bottomLat: 0,
            bottomLong: 0
        }
        let statistics_data = {}
        let range_object = {
            min: '',
            max: ''
        }
        
        let color_object = {
            min: '',
            max: ''
        }

// debugger
        if (common_size_props.min && statistics[common_size_props.min.map] && statistics[common_size_props.min.map][common_size_props.min.column]) {
            range_object.min = statistics[common_size_props.min.map][common_size_props.min.column].min[common_size_props.min.column]
        }

        if (common_size_props.max && statistics[common_size_props.max.map] && statistics[common_size_props.max.map][common_size_props.max.column]) {
            range_object.max = statistics[common_size_props.max.map][common_size_props.max.column].max[common_size_props.max.column]
        }

        if (common_color_props.min && statistics[common_color_props.min.map] && statistics[common_color_props.min.map][common_color_props.min.column]) {
            color_object.min = statistics[common_color_props.min.map][common_color_props.min.column].min[common_color_props.min.column]
        }

        if (common_color_props.max && statistics[common_color_props.max.map] && statistics[common_color_props.max.map][common_color_props.max.column]) {
            color_object.max = statistics[common_color_props.max.map][common_color_props.max.column].max[common_color_props.max.column]
        }

        if (size_switch[name]) {
            size_equation = calculations[size_switch[name]]
        }

        if (filter_switch[name] && filter_switch[name].switch) {
            filters = filter_options[filter_switch[name].target]
        }

        if (color_equation_switch[name]) {
            color_equation = division[color_equation_switch[name]]
            color_array = colors[color_equation_switch[name]]
        }

        let filtered_data = {}

        $(`.${name}`).empty()

        const data = result.data;
        const headers = result.meta.fields

        let getKeys = {
            latitude: '',
            longitude: ''
        }

        for (let i = 0; i < headers.length; i++) {
            if (headers[i].toLowerCase().indexOf('lon') !== -1) {
                getKeys.longitude = headers[i]
            }
            if (headers[i].toLowerCase().indexOf('lat') !== -1) {
                getKeys.latitude = headers[i]
            }
        }

        data.map(list => {
            if (list[centroid_name] !== '(blank)') {
                let is_valid_data = true,
                    is_gray_data = false;

                let lat_cor = Number(list[getKeys.latitude]),
                    long_cor = Number(list[getKeys.longitude]);

                filters.map(filter => {
                    if (filter.value.length !== 0) {
                        if (filter.key === 'Year') {
                            let year_data = Number(list['Year'])
                            if (year_data < filter.value[0] || year_data > filter.value[1]) {
                                is_valid_data = false
                            }
                        } else if (filter.key === 'date') {
                            let get_month_index = convertMonthtoVal(list.Month)
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

                if (filter_centroid.indexOf(list[centroid_name]) !== -1) {
                    is_gray_data = true
                }

                if (list[filter_column.column] && filter_column.value && list[filter_column.column] === filter_column.value) {
                    is_gray_data = true
                }

                if (is_valid_data) {
                    coordinates['topLong'] = (coordinates['topLong'] === 0 || long_cor < coordinates['topLong']) ? long_cor : coordinates['topLong']
                    coordinates['bottomLong'] = (coordinates['bottomLong'] === 0 || long_cor > coordinates['bottomLong']) ? long_cor : coordinates['bottomLong']
                    coordinates['topLat'] = (coordinates['topLat'] === 0 || lat_cor > coordinates['topLat']) ? lat_cor : coordinates['topLat']
                    coordinates['bottomLat'] = (coordinates['bottomLat'] === 0 || lat_cor < coordinates['bottomLat']) ? lat_cor : coordinates['bottomLat']

                    _.each(list, function (value, key) {
                        if (statistics_array.indexOf(key) !== -1) {
                            !statistics_data[key] && (statistics_data[key] = {
                                min: list,
                                max: list,
                                values: []
                            })
                            if (statistics_data[key].min) {
                                statistics_data[key].min = Number(statistics_data[key].min[key]) > Number(value) ? list : statistics_data[key].min
                            }
                            if (statistics_data[key].max) {
                                statistics_data[key].max = Number(statistics_data[key].max[key]) < Number(value) ? list : statistics_data[key].max
                            }

                            if (!isNaN(list[key])) {
                                statistics_data[key].values.push(Number(list[key]))
                            }
                        }
                    })


                    if (!filtered_data[list[centroid_name]]) {
                        filtered_data[list[centroid_name]] = list
                        filtered_data[list[centroid_name]]['grayed'] = is_gray_data
                        filtered_data[list[centroid_name]]['is_centroid_filter'] = (filter_centroid.length !== 0 || !_.isEmpty(filter_column)) ? true : false
                    } else {
                        let get_centroid = filtered_data[list[centroid_name]]

                        for (let i = 0; i < non_compulsory_element.length; i++) {
                            let current_val = Number(get_centroid[non_compulsory_element[i]])
                            let new_val = Number(list[non_compulsory_element[i]])
                            get_centroid[non_compulsory_element[i]] = current_val + new_val
                        }
                    }
                }
            }
        })

        let return_value = CreateMap(getKeys, coordinates, name, filtered_data, color_equation, color_picker[name] || '#2ecc71', scale[name], size_equation, color_array, range_object, centroid_name, common_color_props, color_object)
        for (let key in statistics_data) {
            delete statistics_data[key].values
        }
        this.props.updateStatistics(name, statistics_data)
        this.setState({
            statistics: statistics_data,
            headers: result.meta.fields,
            count: Object.keys(filtered_data).length,
            min_radius: Number(return_value.min_color) || 0,
            max_radius: Number(return_value.max_color) || 0,
            reload: true
        })
    }

    render() {
        let { count, max_radius, min_radius, statistics } = this.state
        let { division, name, common_color_props } = this.props

        return (
            <div className="maps-display">
                {count !== 0 ? <div className="maps-details">
                    <FontAwesomeIcon className="icons" icon="info-circle" onClick={this.showDrawer} />
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
                <Legends data={common_color_props.division || []} max_radius={max_radius} min_radius={min_radius} />
                <Drawer
                    title="Statistics"
                    placement={this.state.placement}
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <CollapseComponent data={statistics} />
                </Drawer>
            </div>
        );
    }
}

const mapStateToProps = props => {
    let { filters } = props

    return {
        filter_options: _.cloneDeep(filters.filter_options),
        centroid_filters: _.cloneDeep(filters.centroid_filters),
        column_filters: _.cloneDeep(filters.column_filters),
        color_picker: filters.color_picker,
        division: filters.division,
        scale: filters.scale,
        calculations: _.cloneDeep(filters.calculations),
        colors: filters.colors,
        filter_switch: filters.filter_switch,
        color_equation_switch: filters.color_equation_switch,
        size_switch: filters.size_switch,
        reload: filters.reload,
        bubble_size: _.cloneDeep(filters.bubble_size),
        statistics: filters.statistics,
        common_size_props: filters.common_size_props,
        common_color_props: filters.common_color_props
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    modifyScale,
    updateStatistics,
    resetSettings
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RenderMaps)