import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import FilterSelect from '../../../components/filter-select'
import FilterWeek from '../../../components/filter-week'
import FilterDate from '../../../components/filter-date'
import FilterSlider from '../../../components/filter-slider'
import { Select, Switch, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import uuid from 'uuid/v4'
import { submitFilter, switchFilters } from '../../../redux/actions/filter-action'
import { month_options, filter_options } from '../../../default'

const Option = Select.Option;

class Filters extends Component {
    constructor() {
        super()
        this.state = {
            filters: [],
        }
        this.addFilter = this.addFilter.bind(this)
        this.changeFilter = this.changeFilter.bind(this)
        this.yearChange = this.yearChange.bind(this)
        this.submitFilter = this.submitFilter.bind(this)
        this.removeFilter = this.removeFilter.bind(this)
        this.weekChange = this.weekChange.bind(this)
        this.dateChange = this.dateChange.bind(this)
        this.switchFilter = this.switchFilter.bind(this)
    }

    switchFilter(value) {
        let { name } = this.props
        this.props.switchFilters(name, value, name === 'compareone' ? 'comparetwo' : 'compareone')
    }

    dateChange(index, value) {
        let { filters } = this.state
        filters[index].value = value
        filters[index].key = 'date'
        this.setState({
            filters
        })
    }

    weekChange(index, date, dateString) {
        // debugger
    }

    removeFilter(index) {
        let { filters } = this.state
        filters.splice(index, 1)
        this.setState({
            filters
        })
    }

    submitFilter() {
        this.props.submitFilter(this.state.filters, this.props.name)
    }

    yearChange(value, index, key) {
        let { filters } = this.state
        filters[index].value = value
        filters[index].key = key
        this.setState({
            filters
        })
    }

    changeFilter(value, index, key) {
        let { filters } = this.state
        filters[index].type = value
        filters[index].key = key
        this.setState({
            filters
        })
    }

    componentDidMount() {
        let { filter_options, name } = this.props

        if (filter_options[name]) {
            this.setState({
                filters: filter_options[name]
            })
        }
    }

    addFilter() {
        let { filters } = this.state
        filters.push({
            type: '',
            value: '',
            key: ''
        })
        this.setState({
            filters
        })
    }

    render() {
        let { filters } = this.state
        let { centroid_data, is_dual, filter_switch, name } = this.props

        const render_options = {
            year: (index, value) => <FilterSlider value={value} onChange={e => this.yearChange(e, index, 'Year')} />,
            month: (index, value) => <FilterSelect value={value} options={month_options} onChange={e => this.yearChange(e, index, 'Month')} />,
            week: (index) => <FilterWeek onChange={() => this.weekChange(index)} />,
            date: (index) => <FilterDate index={index} onChange={this.dateChange} />,
            centroid: (index, value) => <React.Fragment>
                <span>Centroid:</span><Select
                    mode="multiple"
                    style={{ width: '200px' }}
                    placeholder="Please select"
                    value={value || []}
                    onChange={e => this.yearChange(e, index, 'Centroid')}>
                    {centroid_data.map(list => <Option key={uuid()} value={list}>{list}</Option>)}
                </Select>
            </React.Fragment>
        }

        let switch_val = filter_switch[name] ? filter_switch[name].switch : false

        return (<div className="options-layout">
            <h3>Filters
            <Tooltip placement="rightTop" title={"Specify the options to filter the data"}>
                    <FontAwesomeIcon className="info-icon" icon="info-circle" />
                </Tooltip> {is_dual ?
                    <span style={{ float: 'right', fontSize: '12px' }}>
                        Swap Map filter
                    <Switch size="small" checked={switch_val} onChange={this.switchFilter} />
                    </span>
                    : ''}</h3>


            <div className="filter-list">
                {filters.map((list, index) => {
                    return <div key={uuid()} className="single-filter">
                        <div className="filter-header">
                            <h6>
                                Filter {index + 1}
                                <FontAwesomeIcon className="close" icon="times-circle" onClick={() => this.removeFilter(index)} />
                            </h6>
                        </div>

                        <div className="filter-type">
                            Type: <Select
                                style={{ width: '200px' }}
                                placeholder="Please select"
                                value={list.type}
                                onChange={value => this.changeFilter(value, index)}>
                                {filter_options.map(list => <Option key={uuid()} value={list.value}>{list.text}</Option>)}
                            </Select>
                        </div>
                        <div className="filter-value">
                            {list.type ? render_options[list.type](index, list.value) : ''}
                        </div>
                    </div>
                })}
            </div>
            <div className="filter-button-layout">
                <div className="filter-button" onClick={this.addFilter}>
                    <FontAwesomeIcon className="icon-filter" icon="plus" />
                    Add Filter
            </div>

                <div className="filter-button" onClick={this.submitFilter}>
                    <FontAwesomeIcon className="icon-filter" icon="filter" />
                    Filter
            </div>
            </div>

        </div>)
    }
}

const mapStateToProps = props => {
    let { filters } = props
    return {
        filter_options: filters.filter_options,
        filter_switch: filters.filter_switch,
        is_dual: filters.is_dual
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitFilter,
    switchFilters
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Filters)