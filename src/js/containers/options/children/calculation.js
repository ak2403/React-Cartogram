import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Mention, Tooltip, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setCalculation, switchSizeEquation } from '../../../redux/actions/filter-action'
import { compulsory_element } from '../../../default'

const { toString, toContentState } = Mention;
const Option = Select.Option;

class Calculation extends Component {
    constructor() {
        super()
        this.state = {
            formula: ''
        }
        this.onChange = this.onChange.bind(this)
        this.submit = this.submit.bind(this)
        this.switchSize = this.switchSize.bind(this)
    }

    switchSize(value) {
        let { name } = this.props
        this.props.switchSizeEquation(name, value)
    }

    onChange(value) {
        this.setState({
            formula: toString(value)
        })
    }

    submit() {
        this.props.setCalculation(this.props.name, this.state.formula)
    }

    render() {
        let { headers, calculations, name, maps, size_switch } = this.props

        let filtered_headers = _.filter(headers, list => {
            if (compulsory_element.indexOf(list) === -1) {
                return true
            } else {
                return false
            }
        })
        
        let maps_keys = Object.keys(maps)
        // maps_keys.splice(maps_keys.indexOf(name) ,1)

        return (<div className="options-layout">
            <h3>Equations Size
                <Tooltip placement="rightTop" title={"Specify the equation which determines the size of the circle"}>
                    <FontAwesomeIcon className="info-icon" icon="info-circle" />
                </Tooltip>
                <span style={{ float: 'right', fontSize: '12px' }}>
                    Swap
                        <Select size="small" style={{ width: 100 }} onChange={this.switchSize}>
                        {maps_keys.map(list => <Option value={list}>{list}</Option>)}
                    </Select>
                </span>
            </h3>

            <div className="division-options">
                <Mention
                    style={{ width: '100%' }}
                    defaultSuggestions={filtered_headers}
                    defaultValue={toContentState(calculations[name] || '')}
                    onChange={this.onChange}
                />
                <div className="filter-button-layout">
                    <div className="filter-button right" onClick={this.submit}>
                        <FontAwesomeIcon className="icon-filter" icon="plus" />
                        Submit
                </div>
                </div>

            </div>
        </div>)
    }
}

const mapStateToProps = props => {
    let { filters } = props
    return {
        calculations: filters.calculations,
        size_switch: filters.size_switch,
        maps: filters.maps
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setCalculation,
    switchSizeEquation
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Calculation)