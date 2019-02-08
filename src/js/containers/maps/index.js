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
import Datasets from '../../data'
import { modifyScale, resetSettings } from '../../redux/actions/filter-action'
import { statistics_array, convertMonthtoVal, compulsory_element, non_compulsory_element } from '../../default'

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
        let getScale = scale[name] || 10000

        type === "in" ? getScale += 1000 : getScale -= 1000

        if (getScale > 0) {
            this.props.modifyScale(this.props.name, getScale)
        }
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
        let { filter_options, division, name, calculations, color_picker, scale, colors, color_equation_switch, filter_switch, size_switch, centroid_filters } = this.props
        let filters = filter_options[name] || []
        let color_equation = division[name] || []
        let color_array = colors[name] || []
        let size_equation = calculations[name]
        let filter_centroid = centroid_filters[name] || []
        let coordinates = {
            topLat: 0,
            topLong: 0,
            bottomLat: 0,
            bottomLong: 0
        }
        let statistics_data = {}

        if (size_switch[name] && size_switch[name].switch) {
            size_equation = calculations[size_switch[name].target] || ''
        }

        if (filter_switch[name] && filter_switch[name].switch) {
            filters = filter_options[filter_switch[name].target]
        }

        if (color_equation_switch[name] && color_equation_switch[name].switch) {
            color_equation = division[color_equation_switch[name].target] || []
            color_array = colors[color_equation_switch[name].target] || []
        }

        let filtered_data = {}

        $(`.${name}`).empty()

        const data = result.data;
        const headers = result.meta.fields

        let getKeys = {
            latitude: '',
            longitude: ''
        }
        
        for(let i=0;i< headers.length;i++){
            if(headers[i].toLowerCase().indexOf('long') !== -1){
                getKeys.longitude = headers[i]
            }
            if(headers[i].toLowerCase().indexOf('lat') !== -1){
                getKeys.latitude = headers[i]
            }
        }

        data.map(list => {
            if (list.Centroid !== '(blank)') {
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

                if (filter_centroid.indexOf(list.Centroid) !== -1) {
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


                    if (!filtered_data[list.Centroid]) {
                        filtered_data[list.Centroid] = list
                        filtered_data[list.Centroid]['grayed'] = is_gray_data
                        filtered_data[list.Centroid]['is_centroid_filter'] = filter_centroid.length !== 0 ? true : false
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

        let return_value = CreateMap(getKeys, coordinates, name, filtered_data, color_equation, color_picker[name] || '#2ecc71', scale[name], size_equation, color_array)
        this.setState({
            statistics: statistics_data,
            headers: result.meta.fields,
            count: Object.keys(filtered_data).length,
            min_radius: return_value.min_color,
            max_radius: return_value.max_color,
            reload: true
        })
    }

    render() {
        let { count, max_radius, min_radius, statistics } = this.state
        let { division, name } = this.props

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
                <Legends data={division[name] || []} max_radius={max_radius} min_radius={min_radius} />
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
        color_picker: filters.color_picker,
        division: filters.division,
        scale: filters.scale,
        calculations: filters.calculations,
        colors: filters.colors,
        filter_switch: filters.filter_switch,
        color_equation_switch: filters.color_equation_switch,
        size_switch: filters.size_switch,
        reload: filters.reload
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    modifyScale,
    resetSettings
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RenderMaps)