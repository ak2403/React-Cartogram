import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Select, Switch, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import uuid from 'uuid/v4'
import { setCentroidFilter } from '../../../redux/actions/filter-action'

const Option = Select.Option;

class CentroidFilters extends Component {
    constructor() {
        super()
        this.state = {
            filters: [],
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(value){
        this.setState({
            filters: value
        })
    }

    onSubmit(value) {
        let { filters } = this.state
        let { name } = this.props
        this.props.setCentroidFilter(name, filters)
    }

    render() {
        let { centroid_data, name } = this.props

        return (<div className="options-layout">
            <h3>Centroid Filters
            <Tooltip placement="rightTop" title={"Specify the options to filter the data based on the centroid"}>
                    <FontAwesomeIcon className="info-icon" icon="info-circle" />
                </Tooltip></h3>


            <div className="filter-list">
                <span>Centroid:</span>
                <Select
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
            </div>

        </div>)
    }
}

const mapStateToProps = props => {
    let { filters } = props
    return {

    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setCentroidFilter
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CentroidFilters)