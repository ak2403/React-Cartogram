import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Select, Input, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import uuid from 'uuid/v4'
import { setCentroidFilter, setColumnFilter, clearColumnFilter, clearCentroidFilter } from '../../../redux/actions/filter-action'

const Option = Select.Option;

class CentroidFilters extends Component {
    constructor() {
        super()
        this.state = {
            filters: [],
            column_filter: {
                column: '',
                value: ''
            }
        }
        this.columnChange = this.columnChange.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.columnSubmit = this.columnSubmit.bind(this)
        this.columnClear = this.columnClear.bind(this)
        this.centroidClear = this.centroidClear.bind(this)
    }

    centroidClear(){
        this.props.clearCentroidFilter(this.props.name)
        this.setState({
            filters: []
        })
    }

    columnClear() {
        this.props.clearColumnFilter(this.props.name)
        this.setState({
            column_filter: {
                column: '',
                value: ''
            }
        })
    }

    columnChange(name, value) {
        let { column_filter } = this.state
        column_filter[name] = value
        this.setState({
            column_filter
        })
    }

    onChange(value) {
        this.setState({
            filters: value
        })
    }

    onSubmit(value) {
        let { filters } = this.state
        let { name } = this.props
        this.props.setCentroidFilter(name, filters)
    }

    columnSubmit() {
        let { column_filter } = this.state
        let { name } = this.props
        this.props.setColumnFilter(name, column_filter)
    }

    componentDidMount() {
        let { name, centroid_filters, column_filters } = this.props
        if (centroid_filters[name]) {
            this.setState({
                filters: centroid_filters[name]
            })
        }

        if(column_filters[name]){
            this.setState({
                column_filter: column_filters[name]
            })
        }
    }

    render() {
        let { filters, column_filter } = this.state
        let { centroid_data, headers } = this.props

        return (<div className="options-layout">
            <h3>Location Filters
            <Tooltip placement="rightTop" title={"Specify the options to filter the data based on the centroid"}>
                    <FontAwesomeIcon className="info-icon" icon="info-circle" />
                </Tooltip></h3>


            <div className="filter-list">
                <span>Centroid:</span>
                <Select
                    value={filters}
                    mode="multiple"
                    style={{ width: '200px', float: 'right' }}
                    placeholder="Please select"
                    onChange={this.onChange}
                >
                    {centroid_data.map(list => <Option key={uuid()} value={list}>{list}</Option>)}
                </Select>
            </div>
            <div className="filter-button-layout">
                <div className="filter-button" onClick={this.onSubmit}>
                    <FontAwesomeIcon className="icon-filter" icon="filter" />
                    Filter
                </div>
                <div className="filter-button" onClick={this.centroidClear}>
                    <FontAwesomeIcon className="icon-filter" icon="filter" />
                    Clear
                </div>
            </div>

            <div className="filter-list justify-flex">
                <span>Column</span>
                <Select
                    value={column_filter.column || ''}
                    onChange={value => this.columnChange('column', value)}
                    style={{ width: '110px' }}
                    placeholder="Please select"
                >
                    {headers.map(list => <Option key={uuid()} value={list}>{list}</Option>)}
                </Select>
                <Input style={{ width: '110px' }} value={column_filter.value || ''} onChange={e => this.columnChange('value', e.target.value)} />
            </div>
            <div className="filter-button-layout">
                <div className="filter-button" onClick={this.columnSubmit}>
                    <FontAwesomeIcon className="icon-filter" icon="filter" />
                    Filter
                </div>
                <div className="filter-button" onClick={this.columnClear}>
                    <FontAwesomeIcon className="icon-filter" icon="filter" />
                    Clear
                </div>
            </div>

        </div>)
    }
}

const mapStateToProps = props => {
    let { filters } = props
    return {
        centroid_filters: filters.centroid_filters,
        column_filters: filters.column_filters
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setCentroidFilter,
    setColumnFilter,
    clearColumnFilter,
    clearCentroidFilter
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CentroidFilters)