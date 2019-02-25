import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import uuid from 'uuid/v4'
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
            bubble_props: {
                min: {
                    map: '',
                    column: ''
                },
                max: {
                    map: '',
                    column: ''
                }
            },
            is_loaded: false
        }
        this.parentChange = this.parentChange.bind(this)
        this.childChange = this.childChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onClear = this.onClear.bind(this)
    }

    onSubmit() {
        this.props.updateBubbleSize(this.props.name, this.state.bubble_props)
        this.setState({
            is_loaded: true
        })
    }

    onClear() {
        this.props.clearBubbleSize(this.props.name)
        this.setState({
            is_loaded: true
        })
    }

    parentChange(key, value) {
        let { bubble_props } = this.state
        bubble_props[key] = {
            ...this.state.bubble_props[key],
            map: value
        }
        this.setState({
            bubble_props
        })
    }

    childChange(key, value) {
        let { bubble_props } = this.state
        bubble_props[key] = {
            ...this.state.bubble_props[key],
            column: value
        }
        this.setState({
            bubble_props
        })
    }

    componentDidMount() {
        let { bubble_size, name } = this.props

        if (bubble_size[name]) {
            this.setState({
                bubble_props: bubble_size[name]
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let { bubble_size, name } = nextProps
        let { is_loaded } = nextState

        if (is_loaded) {
            this.setState({
                bubble_props: bubble_size[name] || {
                    min: {
                        map: '',
                        column: ''
                    },
                    max: {
                        map: '',
                        column: ''
                    }
                },
                is_loaded: false
            })
        }

        return true
    }

    render() {
        let { bubble_props } = this.state
        let { bubble_size, statistics, name } = this.props

        let option_values = Object.keys(statistics)
        let min_child_options = bubble_props.min.map ? Object.keys(statistics[bubble_props.min.map]) : []
        let max_child_options = bubble_props.max.map ? Object.keys(statistics[bubble_props.max.map]) : []

        return (<div className="options-layout">
            <h3>Size Options
                <Tooltip placement="rightTop" title={"Specify the min and max of the bubble"}>
                    <FontAwesomeIcon className="info-icon" icon="info-circle" />
                </Tooltip>
            </h3>

            <div className="division-options justify-flex">
                Min
                <Select
                    value={bubble_props.min.map || ''}
                    size="small" style={{ width: 100 }} onChange={value => this.parentChange('min', value)}>
                    {option_values.map(list => <Option key={uuid()} value={list}>{list}</Option>)}
                </Select>
                <Select
                    value={bubble_props.min.column || ''} 
                    size="small" style={{ width: 100 }} onChange={value => this.childChange('min', value)}>
                    {min_child_options.map(list => <Option key={uuid()} value={list}>{list}</Option>)}
                </Select>
            </div>

            <div className="division-options justify-flex">
                Max
                <Select
                    value={bubble_props.max.map || ''} 
                    size="small" style={{ width: 100 }} onChange={value => this.parentChange('max', value)}>
                    {option_values.map(list => <Option key={uuid()} value={list}>{list}</Option>)}
                </Select>
                <Select
                    value={bubble_props.max.column || ''} 
                    size="small" style={{ width: 100 }} onChange={value => this.childChange('max', value)}>
                    {max_child_options.map(list => <Option key={uuid()} value={list}>{list}</Option>)}
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
        statistics: filters.statistics,
        bubble_size: _.cloneDeep(filters.bubble_size)
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    updateBubbleSize,
    clearBubbleSize
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SizeOption)