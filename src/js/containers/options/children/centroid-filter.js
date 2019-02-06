import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Select, Switch, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import uuid from 'uuid/v4'

const Option = Select.Option;

class CentroidFilters extends Component {
    constructor() {
        super()
        this.state = {
            filters: [],
        }
    }

    render() {
        let { centroid_data, name } = this.props
        
        return (<div className="options-layout">
            <h3>Centroid Filters
            <Tooltip placement="rightTop" title={"Specify the options to filter the data"}>
                    <FontAwesomeIcon className="info-icon" icon="info-circle" />
                </Tooltip></h3>


            <div className="filter-list">
                <span>Centroid:</span>
                <Select
                    mode="multiple"
                    style={{ width: '200px' }}
                    placeholder="Please select"
                    // onChange={e => this.yearChange(e, index, 'Centroid')}
                    >
                    {centroid_data.map(list => <Option key={uuid()} value={list}>{list}</Option>)}
                </Select>
            </div>
            <div className="filter-button-layout">
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

    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CentroidFilters)