import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Mention, Tooltip, Select, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { updateBubbleSize, clearBubbleSize } from '../../../redux/actions/filter-action'

const { toString, toContentState } = Mention;
const Option = Select.Option;

class SizeOption extends Component {
    constructor() {
        super()
        this.state = {
            min: {
                map: '',
                column: ''
            },
            max: {
                map: '',
                column: ''
            }
        }
        this.parentChange = this.parentChange.bind(this)
        this.childChange = this.childChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onClear = this.onClear.bind(this)
    }

    onSubmit() {
        this.props.updateBubbleSize(this.props.name, this.state)
    }

    onClear(){
        this.props.clearBubbleSize(this.props.name)
    }

    parentChange(key, value) {
        this.setState({
            [key]: {
                ...this.state[key],
                map: value
            }
        })
    }

    childChange(key, value) {
        this.setState({
            [key]: {
                ...this.state[key],
                column: value
            }
        })
    }

    render() {
        let { min, max } = this.state
        let { headers, statistics, name } = this.props

        let option_values = Object.keys(statistics)
        let min_child_options = min.map ? Object.keys(statistics[min.map]) : []
        let max_child_options = max.map ? Object.keys(statistics[max.map]) : []

        return (<div className="options-layout">
            <h3>Size Options
                <Tooltip placement="rightTop" title={"Specify the min and max of the bubble"}>
                    <FontAwesomeIcon className="info-icon" icon="info-circle" />
                </Tooltip>
            </h3>

            <div className="division-options justify-flex">
                Min
                <Select size="small" style={{ width: 100 }} onChange={value => this.parentChange('min', value)}>
                    {option_values.map(list => <Option value={list}>{list}</Option>)}
                </Select>
                <Select size="small" style={{ width: 100 }} onChange={value => this.childChange('min', value)}>
                    {min_child_options.map(list => <Option value={list}>{list}</Option>)}
                </Select>
            </div>

            <div className="division-options justify-flex">
                Max
                <Select size="small" style={{ width: 100 }} onChange={value => this.parentChange('max', value)}>
                    {option_values.map(list => <Option value={list}>{list}</Option>)}
                </Select>
                <Select size="small" style={{ width: 100 }} onChange={value => this.childChange('max', value)}>
                    {max_child_options.map(list => <Option value={list}>{list}</Option>)}
                </Select>
            </div>

            <Button onClick={this.onSubmit}>Submit</Button>
            <Button onClick={this.onClear}>Clear</Button>
        </div>)
    }
}

const mapStateToProps = props => {
    let { filters } = props
    return {
        statistics: filters.statistics
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    updateBubbleSize,
    clearBubbleSize
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SizeOption)